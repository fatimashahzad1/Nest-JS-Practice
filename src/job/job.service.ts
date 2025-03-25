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
}
