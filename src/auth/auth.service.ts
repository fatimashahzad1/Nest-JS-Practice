import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { TOKEN_EXPIRATION } from 'src/constants/index';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signIn(email: string, pass: string, response: Response): Promise<any> {
    // Find the user by email
    const user = await this.usersService.findOne({ where: { email: email } });
    // Check if the user exists
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    // Generate and return a JWT access token
    const payload = { id: user.id, email: user.email }; // Adjust payload as needed
    const accessToken = await this.jwtService.signAsync(payload);
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return {
      message: 'Login successful.',
    };
  }

  async verification(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
      const user = await this.usersService.findOne({
        where: { email: decoded.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      await this.usersService.updateUser({
        where: { email: decoded.email },
        data: { isVerified: true },
        reauthenticate: false,
      });

      return {
        message: 'Verification successful.',
        success: 'Success',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'The token has expired. Please request a new verification email.',
        );
      }

      throw new UnauthorizedException('Invalid or malformed token.');
    }
  }

  async forgotPassword(email: string): Promise<any> {
    try {
      const user = await this.usersService.findOne({ where: { email: email } });
      if (!user) {
        throw new NotFoundException('User with this email does not exist.');
      }
      //create token
      const payload = { id: user.id, email: user.email };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: TOKEN_EXPIRATION.VERIFICATION,
      });
      //send email
      await this.mailService.sendResetPasswordLink(user.name, email, token);
      return {
        message: 'Reset password link sent to your email.',
        success: 'Success',
        statusCode: HttpStatus.OK,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Handle specific errors for better debugging
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Default error response
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  async resetPassword(
    password: string,
    confirmPassword: string,
    token: string,
  ): Promise<any> {
    try {
      if (password !== confirmPassword) {
        throw new BadRequestException(
          'Password and confirm password do not match.',
        );
      }
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
      const user = await this.usersService.findOne({
        where: { email: decoded.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.usersService.updateUser({
        where: { email: decoded.email },
        data: { password: await bcrypt.hash(password, 10) },
        reauthenticate: false,
      });
      return {
        message: 'Password Successfully Changed',
        success: 'Success',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'The token has expired. Please request a new verification email.',
        );
      }

      throw error;
    }
  }
}
