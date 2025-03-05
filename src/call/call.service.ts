import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CallService {
  constructor(private readonly prisma: PrismaService) {}

  async createCall(
    initiatorId: number,
    receiverId: number,
    status: 'RECEIVED' | 'REJECTED' | 'MISSED',
  ) {
    return await this.prisma.call.create({
      data: { initiatorId, receiverId, status },
    });
  }

  async getUserCalls(userId: number) {
    const calls = await this.prisma.call.findMany({
      where: {
        OR: [
          { initiatorId: userId }, // Calls where the user is the initiator
          { receiverId: userId }, // Calls where the user is the receiver
        ],
      },
      include: {
        initiator: { select: { id: true, name: true } }, // Fetch initiator details
        receiver: { select: { id: true, name: true } }, // Fetch receiver details
      },
      orderBy: {
        createdAt: 'desc', // Sort by latest calls first
      },
    });
    // Transform response to add callSend and callReceived
    return calls.map((call) => ({
      id: call.id,
      createdAt: call.createdAt,
      status: call.status,
      initiator: call.initiator,
      receiver: call.receiver,
      callSend: call.initiatorId === userId, // If user is the initiator
      callReceived: call.receiverId === userId, // If user is the receiver
    }));
  }
}
