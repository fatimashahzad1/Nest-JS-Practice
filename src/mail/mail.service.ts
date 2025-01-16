import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
  APP_NAME,
  RESET_PASSWORD_ROUTE,
  VERIFICATION_ROUTE,
} from 'src/constants/index';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string, year: string) {
    const url = `${process.env.CLIENT_URL}${VERIFICATION_ROUTE}?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './verification',
      context: {
        name: user.name,
        url,
        year,
      },
    });
  }

  async sendResetPasswordLink(name: string, email: string, token: string) {
    const resetLink = `${process.env.CLIENT_URL}${RESET_PASSWORD_ROUTE}?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      template: './reset',
      context: {
        name,
        email,
        resetLink,
        companyName: APP_NAME,
      },
    });
  }
}
