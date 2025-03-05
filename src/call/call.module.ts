import { Module } from '@nestjs/common';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CallController],
  providers: [CallService, PrismaService],
  imports: [UsersModule],
})
export class CallModule {}
