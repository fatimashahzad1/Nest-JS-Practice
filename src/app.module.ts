import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TweetService } from './tweet/tweet.service';
import { TweetController } from './tweet/tweet.controller';
import { TweetModule } from './tweet/tweet.module';

@Module({
  imports: [UsersModule, TweetModule],
  controllers: [AppController, TweetController],
  providers: [AppService, TweetService],
})
export class AppModule {}
