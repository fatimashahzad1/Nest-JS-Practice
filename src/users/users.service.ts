import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  users: CreateUserDTO[] = [
    {
      id: 1,
      name: 'fatima',
      age: 23,
      gender: 'female',
      email: 'fatima@gmail.com',
      isMarried: false,
      password: '123456',
    },
    {
      id: 2,
      name: 'hafsa',
      age: 21,
      gender: 'female',
      email: 'hafsa@gmail.com',
      isMarried: false,
      password: '123456',
    },
    {
      id: 3,
      name: 'khadija',
      age: 21,
      gender: 'female',
      email: 'khadija@gmail.com',
      password: '123456',
    },
    {
      id: 4,
      name: 'abc',
      age: 21,
      gender: 'male',
      email: 'abc@gmail.com',
      isMarried: true,
      password: '123456',
    },
  ];

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  getAllUsers(limit: number) {
    if (this.authService.isAuthenticated) {
      console.log(
        'isAuthenticated when fetching all users=',
        this.authService.isAuthenticated,
      );
      return this.users.filter((user, index) => {
        if (index < limit) {
          return user;
        }
      });
    }
  }

  getUserById(userId: number) {
    return this.users.find((user) => user.id === userId);
  }

  createUser(user: CreateUserDTO) {
    this.users.push(user);
    return `user with id ${user.id} is created`;
  }
}
