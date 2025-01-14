import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
}
