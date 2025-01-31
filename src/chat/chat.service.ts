import { ForbiddenException, Injectable } from '@nestjs/common';
import { Chat, Message } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  // Create a new chat between two users
  async createChat(currentUserId: number, otherUSerId: number): Promise<Chat> {
    // Check if the users follow each other
    const followRelation = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: otherUSerId,
        },
      },
    });

    if (!followRelation) {
      throw new ForbiddenException(
        'Users must follow each other to start a chat',
      );
    }

    //if chat already exists
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        users: {
          every: {
            OR: [{ id: currentUserId }, { id: otherUSerId }],
          },
        },
      },
    });
    if (existingChat) {
      return existingChat;
    }

    // Create a new chat
    const chat = await this.prisma.chat.create({
      data: {
        users: {
          connect: [{ id: currentUserId }, { id: otherUSerId }],
        },
      },
    });

    return chat;
  }

  // Send a message in a chat
  async sendMessage(
    chatId: number,
    currentUserId: number,
    content: string,
  ): Promise<Message> {
    // Check if the chat exists and contains the sender
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { users: true },
    });

    if (!chat || !chat.users.some((user) => user.id === currentUserId)) {
      throw new Error('Sender is not part of the chat');
    }

    // Create and return a new message
    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderId: currentUserId,
        content,
      },
    });

    return message;
  }

  async getChatMessages(
    chatId: number,
    take: number = 5,
    currentUserID,
    cursor?: number,
  ) {
    // Fetch messages with pagination
    const messages = await this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'desc' }, // Get newest messages first
      take, // Limit results
      skip: cursor ? 1 : 0, // Skip cursor message if provided
      cursor: cursor ? { id: cursor } : undefined, // Cursor-based pagination
      include: {
        sender: {
          select: { id: true, name: true }, // Include sender details
        },
      },
    });

    // Transform the messages to include `isMine` status
    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      senderId: message.senderId,
      senderName: message.sender.name,
      isMine: message.senderId === currentUserID, // Determine if the message was sent by the current user
    }));
  }
}
