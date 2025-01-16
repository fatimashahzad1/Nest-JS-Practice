import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, PrismaService],
  imports: [UsersModule],
})
export class ArticleModule {}
