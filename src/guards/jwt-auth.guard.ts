import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('User must be Login');
    }

    return this.validateToken(token, request);
  }

  // Extract token from the Authorization header (Bearer token)
  private extractTokenFromHeader(request: any): string | undefined {
    const authorization = request.headers['authorization'];
    if (authorization?.startsWith('Bearer ')) {
      return authorization.split(' ')[1];
    }
    return undefined;
  }

  // Validate the token and attach user data
  private async validateToken(token: string, request: any): Promise<boolean> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
      const user = await this.userService.findOne({
        where: { email: decoded.email },
      });
      if (!user) {
        throw new NotFoundException('User notfound token');
      }
      request.user = user;
      return true;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Invalid token');
    }
  }
}
