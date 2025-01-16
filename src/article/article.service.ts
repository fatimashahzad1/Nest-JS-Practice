import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ArticleCreateInput) {
    return this.prisma.article.create({ data });
  }

  findAll(params: { skip?: number; take?: number }) {
    const { skip, take } = params;
    return this.prisma.article.findMany({ skip, take });
  }

  findOne(id: number) {
    return `This action returns a us#${id} article`;
  }
}
