import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CallService {
  constructor(private readonly prisma: PrismaService) {}

  async createCall(
    initiatorId: number,
    receiverId: number,
    status: 'RECEIVED' | 'REJECTED' | 'MISSED',
    callType: 'AUDIO' | 'VIDEO',
  ) {
    return await this.prisma.call.create({
      data: { initiatorId, receiverId, status, callType },
    });
  }

  async getUserCalls(userId: number, page: number, perPage: number) {
    const [calls, total] = await Promise.all([
      this.prisma.call.findMany({
        where: {
          OR: [{ initiatorId: userId }, { receiverId: userId }],
        },
        include: {
          initiator: { select: { id: true, name: true } },
          receiver: { select: { id: true, name: true } },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: page * perPage,
        take: perPage,
      }),
      this.prisma.call.count({
        where: {
          OR: [{ initiatorId: userId }, { receiverId: userId }],
        },
      }),
    ]);

    const transformedCalls = calls.map((call) => ({
      id: call.id,
      createdAt: call.createdAt,
      status: call.status,
      initiator: call.initiator,
      receiver: call.receiver,
      callSend: call.initiatorId === userId,
      callReceived: call.receiverId === userId,
      callType: call.callType,
    }));

    return {
      data: transformedCalls,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
        hasNextPage: (page + 1) * perPage < total,
        hasPreviousPage: page > 0,
      },
    };
  }
}
