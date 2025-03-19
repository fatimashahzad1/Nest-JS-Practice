import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PostCreateInput) {
    const userId = data.author.connect.id; // Assuming you're passing the `author` with the `id` field

    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.post.create({
      data,
    });
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
    include?: Prisma.PostInclude;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async deletePost(id: number): Promise<SuccessResponse> {
    // Check if the post exists before deleting
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    // Delete the post from the database
    await this.prisma.post.delete({ where: { id } });

    return {
      success: 'Success',
      message: 'Post is deleted Successfully.',
      statusCode: HttpStatus.OK,
    };
  }
}
