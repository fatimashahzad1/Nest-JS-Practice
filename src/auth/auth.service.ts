import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ where: { email: email } });
    console.log('user found=', user);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    return {
      access_token: await this.jwtService.signAsync(user),
    };
  }
}
