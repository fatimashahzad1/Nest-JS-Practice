import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostModel } from '@prisma/client';
import { ParseStringPipe } from './pipes/ParseStringPipe.pipe';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() post: CreatePostDto): Promise<PostModel> {
    const { title, content, authorId } = post;
    console.log('post=====', post);
    return this.postService.create({
      title,
      content,
      author: {
        connect: { id: authorId },
      },
    });
  }

  @Get('filter/:searchString')
  async getFilteredPosts(
    @Param('searchString', ParseStringPipe) searchString: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString, mode: 'insensitive' },
          },
          {
            content: { contains: searchString, mode: 'insensitive' },
          },
        ],
      },
    });
  }

  @Get('all')
  async getAllPosts(): Promise<PostModel[]> {
    return this.postService.posts({});
  }
}
