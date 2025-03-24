import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService],
  imports: [UsersModule],
})
export class ArticleModule {}
