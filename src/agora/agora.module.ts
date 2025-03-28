import { Module } from '@nestjs/common';
import { AgoraService } from './agora.service';
import { AgoraController } from './agora.controller';

@Module({
  controllers: [AgoraController],
  providers: [AgoraService],
  exports: [AgoraService], // Export AgoraService for use in other modules
})
export class AgoraModule {}
