import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TweetService {
  constructor(private readonly userService: UsersService) {}

  tweets: Tweet[] = [
    { tweet: 'My name is fatima', date: new Date('07/01/2025'), userId: 1 },
    { tweet: 'I am 23', date: new Date('07/01/2025'), userId: 1 },
    { tweet: 'I am khadija', date: new Date('06/01/2025'), userId: 3 },
    { tweet: 'I am 21', date: new Date('06/01/2025'), userId: 3 },
  ];

  getAllTweetsForAUser(userId: number) {
    const user = this.userService.getUserById(userId);
    const tweets = this.tweets.filter((tweet) => tweet.userId === userId);
    return tweets.map((tweet) => {
      return {
        tweet: tweet.tweet,
        name: user.name,
      };
    });
  }
}
