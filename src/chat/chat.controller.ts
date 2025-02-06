import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Create a chat between two users
  @Post('create')
  async createChat(@Body() createChatDto: CreateChatDto, @Request() req) {
    return this.chatService.createChat(req.user.id, createChatDto.otherUserId);
  }

  // Send a message in an existing chat
  @Post('messages/:chatId')
  async sendMessage(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() sendMessageDto: SendMessageDto,
    @Request() req,
  ) {
    const { content } = sendMessageDto;
    return this.chatService.sendMessage(chatId, req.user.id, content);
  }

  // Get all messages of a chat
  @Get('messages/:chatId')
  async getChatMessages(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Request() req,
    @Query('take') take?: number,
    @Query('cursor') cursor?: number,
  ) {
    return this.chatService.getChatMessages(chatId, req.user.id, take, cursor);
  }
  //Get all chats of a user
  @Get('all')
  async getAllChats(@Request() req) {
    return this.chatService.getUserChats(req.user.id);
  }
}
