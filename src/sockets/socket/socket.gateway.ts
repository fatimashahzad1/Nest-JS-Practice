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
import { RtcRole } from 'agora-access-token';
import { Server, Socket } from 'socket.io';
import { AgoraService } from 'src/agora/agora.service';
import { CallService } from 'src/call/call.service';
import { CALL_STATUS } from 'src/constants/index';
import { PrismaService } from 'src/prisma/prisma.service';

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

  constructor(
    private readonly prisma: PrismaService,
    private readonly agoraTokenService: AgoraService,
    private readonly callService: CallService,
  ) {}

  private readonly users = new Map<number, Socket>();
  private readonly jwtService = new JwtService();
  private readonly activeCalls = new Map<
    string,
    {
      callerId: number;
      callerName: string;
      receiverId: number;
      receiverName: string;
      type: 'AUDIO' | 'VIDEO';
    }
  >();

  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers['authorization']?.split(' ')[1]; // Bearer token

    if (token) {
      try {
        // Verify the token using the JWT service
        const user = await this.jwtService.verifyAsync(token, {
          secret: process.env.SECRET_KEY,
        });

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
    const receiver = chat.users.filter((user) => currentUser.id !== user.id)[0];
    const receiverSocket = this.users.get(receiver.id);
    // You could also specify who to send to (e.g., based on `chatId` or user IDs)
    receiverSocket.emit('message', {
      content: data.message,
      chatId: data.chatId,
      isMine: false,
      createdAt: new Date(),
    });
  }

  @SubscribeMessage('callUser')
  async handleCallUser(
    @MessageBody()
    data: {
      callerId: number;
      callerName: string;
      receiverId: number;
      receiverName: string;
      type: 'AUDIO' | 'VIDEO';
    },
  ) {
    console.log('here in callUser', data);
    const { callerId, callerName, receiverId, receiverName, type } = data;
    const channelName = `call-${callerId}-${receiverId}`;

    // Generate Agora token
    const token = this.agoraTokenService.generateToken(
      channelName,
      callerId,
      RtcRole.PUBLISHER,
    );

    // Save call state
    this.activeCalls.set(channelName, {
      callerId,
      callerName,
      receiverId,
      receiverName,
      type,
    });
    // send caller token recipient
    this.users
      .get(callerId)
      .emit('getCallToken', { token, channelName, callerId, callerName });

    // Notify recipient
    this.users.get(receiverId).emit('incomingCall', {
      callerId,
      callerName,
      receiverId,
      receiverName,
      channelName,
      type,
    });
  }

  @SubscribeMessage('acceptCall')
  async handleAcceptCall(
    @MessageBody()
    data: {
      callerId: number;
      callerName: string;
      receiverId: number;
      receiverName: string;
      type: 'AUDIO' | 'VIDEO';
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { callerId, receiverId, callerName, receiverName, type } = data;
    const channelName = `call-${callerId}-${receiverId}`;
    if (!this.activeCalls.has(channelName)) {
      client.emit('callError', { message: 'Call not found or expired' });
      return;
    }

    const token = this.agoraTokenService.generateToken(
      channelName,
      receiverId,
      RtcRole.SUBSCRIBER,
    );
    //goes to one accepting the call for token
    this.users.get(receiverId)?.emit('getReceiverToken', {
      callerId,
      callerName,
      receiverId,
      receiverName,
      channelName,
      token,
      type,
    });
    await this.callService.createCall(
      callerId,
      receiverId,
      CALL_STATUS.RECEIVED,
      type,
    );
  }

  @SubscribeMessage('leaveCall')
  async handleLeaveCall(
    @MessageBody() data: { channelName: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { channelName } = data;
    console.log('here in leave call..............');

    if (!this.activeCalls.has(channelName)) {
      client.emit('callError', { message: 'Call not found or already ended' });
      return;
    }
    // Remove the call from active calls
    this.activeCalls.delete(channelName);
  }

  @SubscribeMessage('rejectCall')
  async handleRejectCall(
    @MessageBody()
    data: {
      callerId: number;
      receiverId: number;
      channelName: string;
      callType: 'AUDIO' | 'VIDEO';
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { callerId, receiverId, channelName, callType } = data;

    // Check if the call exists in active calls
    if (!this.activeCalls.has(channelName)) {
      client.emit('callError', { message: 'Call not found or already ended' });
      return;
    }

    // Notify the caller that the call was rejected
    const callerSocket = this.users.get(callerId);
    if (callerSocket) {
      callerSocket.emit('callRejected', {
        receiverId,
        channelName,
        message: 'The call was rejected by the receiver.',
      });
    }

    // Remove the call from active calls
    this.activeCalls.delete(channelName);

    // Optionally, log or update the call status in the database
    await this.callService.createCall(
      callerId,
      receiverId,
      CALL_STATUS.REJECTED,
      callType,
    );

    console.log(`Call rejected: channelName=${channelName}`);
  }
}
