import { RtcTokenBuilder } from 'agora-access-token';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AgoraService {
  private readonly appId = process.env.AGORA_APP_ID;
  private readonly appCertificate = process.env.AGORA_APP_CERTIFICATE;

  generateToken(channelName: string, uid: number, role: number): string {
    const expirationTimeInSeconds = 3600 * 24; // Token validity (1 hour)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    return RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs,
    );
  }
}
