import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  isAuthenticated = false;
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  login(email: string, password: string) {
    const user = this.usersService.users.find((user) => user.email === email);
    if (user.email === email && user.password === password) {
      this.isAuthenticated = true;
      return 'Token';
    }
    return 'User does not exist';
  }
}
