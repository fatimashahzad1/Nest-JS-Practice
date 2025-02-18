import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma.service';

@WebSocketGateway(3005, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your frontend URL (e.g., React app URL)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
}) // The same port as your client is connecting to
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly prisma: PrismaService) {}
  private readonly users = new Map<number, Socket>();
  private readonly jwtService = new JwtService();

  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers['authorization']?.split(' ')[1]; // Bearer token

    if (token) {
      try {
        // Verify the token using the JWT service
        const user = await this.jwtService.verifyAsync(token, {
          secret: process.env.SECRET_KEY,
        });

        console.log(`User connected: userID=${user.id}, socket=${socket.id}`);

        // Store the user id or socket in the user map
        this.users.set(user.id, socket);
      } catch (error) {
        console.error('JWT verification failed:', error);
        socket.disconnect(); // Disconnect if the token is invalid
      }
    } else {
      console.error('No token found');
      socket.disconnect(); // Disconnect if no token is provided
    }
  }

  // Handle user disconnection
  async handleDisconnect(socket: Socket) {
    const token = socket.handshake.headers['authorization']?.split(' ')[1]; // Bearer token
    if (token) {
      try {
        // Verify the token using the JWT service
        const user = await this.jwtService.verifyAsync(token, {
          secret: process.env.SECRET_KEY,
        });

        console.log(
          `User disconnected: userID=${user.id}, socket=${socket.id}`,
        );

        // Store the user id or socket in the user map
        this.users.delete(user.id);
      } catch (error) {
        console.error('JWT verification failed:', error);
        socket.disconnect(); // Disconnect if the token is invalid
      }
    } else {
      console.error('No token found');
      socket.disconnect(); // Disconnect if no token is provided
    }
  }

  // Listen for incoming messages from clients
  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { chatId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('*************=', client);
    const token = client.handshake.headers['authorization']?.split(' ')[1]; // Bearer token
    const currentUser = await this.jwtService.verifyAsync(token, {
      secret: process.env.SECRET_KEY,
    });

    // Broadcast the message to all connected users
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: data.chatId,
      },
      select: {
        users: true,
      },
    });
    console.log({ chat });
    const receiver = chat.users.filter((user) => currentUser.id !== user.id)[0];
    console.log({ receiver });
    const receiverSocket = this.users.get(receiver.id);
    // You could also specify who to send to (e.g., based on `chatId` or user IDs)
    receiverSocket.emit('message', {
      content: data.message,
      chatId: data.chatId,
      isMine: false,
      createdAt: new Date(),
    });
  }
}
