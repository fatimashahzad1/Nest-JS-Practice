import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_EXPIRATION } from 'src/constants/index';
import { LinkDTO } from './dtos/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'src/constants';

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
    const user = await this.prisma.user.findUnique({
      where,
      select: {
        id: true,
        email: true,
        password: true,
        address: true,
        phoneNumber: true,
        country: true,
        bankNo: false,
        isAdmin: true,
        name: true,
        firstName: true,
        lastName: true,
        location: true,
        profession: true,
        bio: true,
        userType: true,
        companyName: true,
        companyWebsite: true,
        companySize: true,
        links: {
          select: {
            id: true,
            platform: true,
            url: true,
            createdAt: false,
            updatedAt: false,
          },
        },
        pictureUrl: true,
        acceptTerms: false,
        isVerified: false,
        _count: {
          select: {
            posts: true, // Count the number of posts
          },
        },
      },
    });
    if (user) return user;
    else {
      throw new NotFoundException('User not found.');
    }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<CreateUserResponse> {
    try {
      const {
        name,
        email,
        password,
        acceptTerms,
        phoneNumber,
        address,
        country,
        bankNo,
        companyName,
        companyWebsite,
        companySize,
        userType,
      } = data;
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create the user and capture the created user
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          acceptTerms,
          phoneNumber,
          address,
          country,
          bankNo,
          companyName,
          companySize,
          companyWebsite,
          userType,
        },
      });

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
    reauthenticate: boolean;
    include?: Prisma.UserInclude;
    links?: LinkDTO[];
  }): Promise<User & { token?: string }> {
    const { where, data, include, links } = params;
    const user = await this.prisma.user.update({
      data,
      where,
      include,
    });

    // If links are provided, handle them
    if (links && links.length > 0) {
      // Delete existing links
      await this.prisma.link.deleteMany({
        where: { userId: user.id },
      });

      // Create new links
      await this.prisma.link.createMany({
        data: links.map((link) => ({
          platform: link.platform,
          url: link.url,
          userId: user.id,
        })),
      });
    }

    // Return the updated user with new links
    const updatedUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        links: true,
      },
    });

    if (user && params.reauthenticate) {
      const payload = { id: user.id, email: user.email }; // Adjust payload as needed
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: TOKEN_EXPIRATION.VERIFICATION,
      });
      return { ...updatedUser, token };
    }
    return updatedUser;
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<{
    user: Partial<User>;
    success: string;
    message: string;
    statusCode: HttpStatus;
  }> {
    try {
      const user = await this.prisma.user.delete({
        where,
      });
      return {
        user: { name: user.name, email: user.email },
        success: 'Success',
        message: 'User is deleted Successfully.',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        // P2025 is Prisma's code for "Record not found"
        throw new NotFoundException('User not found.');
      }
      throw error; // Re-throw other errors
    }
  }

  async findAllCompanies(
    page: number,
    perPage: number,
  ): Promise<Partial<User>[]> {
    return this.prisma.user.findMany({
      where: {
        userType: UserType.COMPANY, // Filter users with userType "COMPANY"
      },
      skip: page * perPage,
      take: perPage,
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        companyWebsite: true,
        companySize: true,
        location: true,
        pictureUrl: true,
        country: true,
      },
      orderBy: {
        name: 'asc', // Order by creation date (optional)
      },
    });
  }
}
