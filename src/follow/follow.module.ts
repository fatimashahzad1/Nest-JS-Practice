import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
  imports: [UsersModule],
})
export class FollowModule {}
