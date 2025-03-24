import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { Chat } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}
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
  async sendMessage(chatId: number, currentUserId: number, content: string) {
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

    return {
      chatId: message.chatId,
      message: message.content,
      success: 'Success',
      statusCode: HttpStatus.OK,
    };
  }

  async getChatMessages(
    chatId: number,
    currentUserID: number,
    take?: number,
    cursor?: number,
  ) {
    // Fetch messages with pagination
    const messages = await this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'desc' }, // Get newest messages first
      take: take, // Fetch one extra message to determine next cursor
      skip: cursor ? 1 : 0, // Skip cursor message if provided
      cursor: cursor ? { id: cursor } : undefined, // Cursor-based pagination
      include: {
        sender: {
          select: { id: true, name: true }, // Include sender details
        },
      },
    });
    // Determine nextCursor
    let nextCursor: number | null = null;
    if (messages.length >= take) {
      const lastMessage = messages.at(-1); // Remove extra message
      nextCursor = lastMessage?.id || null;
    }

    const transformMessages = messages.map((message) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      senderId: message.senderId,
      senderName: message.sender.name,
      isMine: message.senderId === currentUserID, // Determine if the message was sent by the current user
    }));
    return {
      messages: transformMessages.reverse(),
      nextCursor, // Return next cursor for pagination
    };
  }

  async getUserChats(userId: number) {
    const chats = await this.prisma.chat.findMany({
      where: {
        users: {
          some: { id: userId }, // Fetch chats where user is a participant'
        },
      },
      include: {
        users: {
          where: { id: { not: userId } },
          include: {
            following: {
              select: {
                followerId: true,
                followingId: true,
              },
              where: { followerId: userId },
            },
          },
        }, // Exclude the logged-in user},
        messages: {
          orderBy: { createdAt: 'desc' }, // Order messages by latest
          take: 1, // Fetch only the latest message for preview
          select: {
            content: true,
            createdAt: true,
          },
        },
      },
    });
    // Filter out users where `following` array length is <= 1
    return chats.filter((chat) => chat.users[0].following.length > 0);
  }
}
