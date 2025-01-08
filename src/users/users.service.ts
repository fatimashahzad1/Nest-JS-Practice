import { CreateUserDTO } from './dtos/create-user.dto';

export class UsersService {
  users: CreateUserDTO[] = [
    {
      id: 1,
      name: 'fatima',
      age: 23,
      gender: 'female',
      email: 'fatima@gmail.com',
    },
    {
      id: 2,
      name: 'hafsa',
      age: 21,
      gender: 'female',
      email: 'hafsa@gmail.com',
    },
    {
      id: 3,
      name: 'khadija',
      age: 21,
      gender: 'female',
      email: 'khadija@gmail.com',
    },
  ];

  getAllUsers(limit: number) {
    return this.users.filter((user, index) => {
      if (index < limit) {
        return user;
      }
    });
  }

  getUserById(userId: number) {
    return this.users.find((user) => user.id === userId);
  }

  createUser(user: CreateUserDTO) {
    this.users.push(user);
    return `user with id ${user.id} is created`;
  }
}
