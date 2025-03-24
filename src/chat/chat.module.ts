import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [UsersModule],
})
export class ChatModule {}
