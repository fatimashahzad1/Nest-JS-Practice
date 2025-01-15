import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_EXPIRATION } from 'src/constants/index';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    console.log('here');
    return this.prisma.user.findMany();
  }

  async findOne(params: { where?: Prisma.UserWhereUniqueInput }) {
    const { where } = params;
    const user = await this.prisma.user.findUnique({ where });
    if (user) return user;
    throw new NotFoundException('User not found.');
  }

  async createUser(data: Prisma.UserCreateInput): Promise<CreateUserResponse> {
    try {
      // Hash the password
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);

      // Create the user and capture the created user
      const user = await this.prisma.user.create({ data });

      const payload = { id: user.id, email: user.email }; // Adjust payload as needed
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: TOKEN_EXPIRATION.VERIFICATION,
      });

      // Send user confirmation email
      await this.mailService.sendUserConfirmation(user, token, '2025');

      return {
        user: { name: user.name, email: user.email },
        success: 'Registered Successfully',
        message: 'Verification email is sent to your email.',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // P2002 is the code for unique constraint violation
        throw new ConflictException('Email already exists.');
      }
      throw error;
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        // P2025 is Prisma's code for "Record not found"
        throw new NotFoundException('User not found.');
      }
      throw error; // Re-throw other errors
    }
  }
}
