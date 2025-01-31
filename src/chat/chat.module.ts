import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService],
  imports: [UsersModule],
})
export class ChatModule {}
