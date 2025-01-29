import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [FollowController],
  providers: [FollowService, PrismaService],
  imports: [UsersModule],
})
export class FollowModule {}
