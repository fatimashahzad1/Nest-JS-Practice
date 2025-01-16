import { Body, Controller, Patch, Post, Query, Res } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { ParseTokenPipe } from './pipes/parseTokenPipe.pipe';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  signIn(
    @Body() credentials: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(
      credentials.email,
      credentials.password,
      response,
    );
  }

  @Post('register')
  register(@Body() user: CreateUserDTO) {
    return this.usersService.createUser(user);
  }

  @Patch('verification')
  verification(@Query('token', ParseTokenPipe) token: string) {
    return this.authService.verification(token);
  }

  @Post('password/forgot')
  forgotPassword(@Body() req: ForgotPasswordDto) {
    return this.authService.forgotPassword(req.email);
  }

  @Post('password/reset')
  resetPassword(
    @Body() req: ResetPasswordDto,
    @Query('token', ParseTokenPipe) token: string,
  ) {
    return this.authService.resetPassword(
      req.password,
      req.confirmPassword,
      token,
    );
  }
}
