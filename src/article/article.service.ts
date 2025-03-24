import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ArticleCreateInput) {
    return this.prisma.article.create({ data });
  }

  async findAll(params: { skip?: number; take?: number }) {
    const { skip, take } = params;
    const articles = await this.prisma.article.findMany({
      skip,
      take,
      include: {
        creator: { select: { name: true } },
      },
    });
    return {
      pagination: {
        total_count: await this.prisma.article.count(),
      },
      articles,
    };
  }

  async findOne(id: number) {
    console.log('id got ===', id);
    return await this.prisma.article.findUnique({
      where: { id: id },
      include: {
        creator: { select: { name: true } },
      },
    });
  }
}
