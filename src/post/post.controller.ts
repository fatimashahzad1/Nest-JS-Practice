import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostModel } from '@prisma/client';
import { ParseStringPipe } from './pipes/ParseStringPipe.pipe';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/constants';
import { POST_TYPE, POST_TYPE_NUMBER } from 'src/constants/index';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() post: CreatePostDto): Promise<PostModel> {
    const { content, authorId, type, postImage } = post;
    console.log('post=====', post);
    return this.postService.create({
      content,
      type: type === POST_TYPE_NUMBER.EVENT ? POST_TYPE.EVENT : POST_TYPE.FEED,
      postImage,
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
          // {
          //   title: { contains: searchString, mode: 'insensitive' },
          // },
          {
            content: { contains: searchString, mode: 'insensitive' },
          },
        ],
      },
    });
  }

  @Get('all')
  async getAllPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
