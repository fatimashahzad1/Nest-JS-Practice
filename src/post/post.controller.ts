import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  ParseEnumPipe,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostModel } from '@prisma/client';
import { ParseStringPipe } from './pipes/ParseStringPipe.pipe';
import { AuthGuard } from 'src/guards/auth.guard';
import { POST_TYPE, POST_TYPE_NUMBER } from 'src/constants/index';

@Controller('post')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) { }

  // @Roles(Role.Admin)
  @Post()
  async create(@Body() post: CreatePostDto): Promise<PostModel> {
    const { content, title, authorId, type, postImage, eventTime, eventDate } = post;
    console.log('post=====', post);
    return this.postService.create({
      content,
      type: type === POST_TYPE_NUMBER.EVENT ? POST_TYPE.EVENT : POST_TYPE.FEED,
      postImage,
      title,
      eventTime,
      eventDate,
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

  @Get(':type?')
  async getAllPosts(
    @Param(
      'type',
      new DefaultValuePipe(POST_TYPE_NUMBER.FEED),
      new ParseEnumPipe(POST_TYPE_NUMBER),
    )
    type: POST_TYPE_NUMBER,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(5), ParseIntPipe) perPage: number,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      skip: perPage * page,
      take: perPage,
      where: {
        type:
          type === POST_TYPE_NUMBER.EVENT ? POST_TYPE.EVENT : POST_TYPE.FEED,
      },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
