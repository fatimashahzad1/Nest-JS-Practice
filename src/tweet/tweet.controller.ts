import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TweetService } from './tweet.service';

@Controller('tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get(':userId')
  getAllTweetsForAUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.tweetService.getAllTweetsForAUser(userId);
  }
}
