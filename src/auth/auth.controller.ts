import { Body, Controller, Post, Res } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sign-in')
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
}
