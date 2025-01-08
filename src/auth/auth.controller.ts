import { AuthService } from './auth.service';
import { Body, Controller, forwardRef, Inject, Post } from '@nestjs/common';
import { LoginUserDTO } from './dtos/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  login(@Body() { email, password }: LoginUserDTO) {
    return this.authService.login(email, password);
  }
}
