import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto, userId: number): Promise<Job> {
    console.log('userId in create job', userId);
    return this.prisma.job.create({
      data: {
        ...createJobDto,
        company: {
          connect: { id: userId },
        },
      },
      include: {
        company: true,
      },
    });
  }

  async findAll(): Promise<Job[]> {
    return this.prisma.job.findMany({
      include: {
        company: true,
      },
    });
  }

  async findOne(id: string): Promise<Job> {
    return this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });
  }

  async update(id: string, updateJobDto: Partial<CreateJobDto>): Promise<Job> {
    return this.prisma.job.update({
      where: { id },
      data: updateJobDto,
      include: {
        company: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.job.delete({
      where: { id },
    });
  }

  async findAllWithPagination(
    page: number,
    perPage: number,
  ): Promise<Partial<Job>[]> {
    return this.prisma.job.findMany({
      skip: page * perPage,
      take: perPage,
      select: {
        id: true,
        role: true,
        hourlyRate: true,
        location: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
            pictureUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
