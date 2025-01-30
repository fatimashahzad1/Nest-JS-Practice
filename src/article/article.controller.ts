import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createArticle(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    return this.articleService.create({
      ...createArticleDto,
      creator: {
        connect: { id: req.user.id },
      },
    });
  }

  @Get('all')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
  ) {
    if (page <= 0 || limit <= 0) {
      throw new BadRequestException('Page and limit must be positive numbers.');
    }
    return this.articleService.findAll({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOne(id);
  }
}
