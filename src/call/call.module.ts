import { Module } from '@nestjs/common';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CallController],
  providers: [CallService],
  imports: [UsersModule],
})
export class CallModule {}
