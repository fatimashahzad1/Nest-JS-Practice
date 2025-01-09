import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
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
