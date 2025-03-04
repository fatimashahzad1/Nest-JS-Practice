import { Controller, Get, Query } from '@nestjs/common';
import { AgoraService } from './agora.service';
import { RtcRole } from 'agora-access-token';

@Controller('agora')
export class AgoraController {
  constructor(private readonly agoraService: AgoraService) {}

  @Get('token')
  getAgoraToken(@Query('channel') channel: string, @Query('uid') uid: number) {
    return {
      token: this.agoraService.generateToken(channel, uid, RtcRole.PUBLISHER),
    };
  }
}
