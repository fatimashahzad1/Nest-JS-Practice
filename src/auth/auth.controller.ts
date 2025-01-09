import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() credentials: SignInDto) {
    console.log('credentials', credentials);
    return this.authService.signIn(credentials.email, credentials.password);
  }
}
