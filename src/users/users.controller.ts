import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  @Get()
  getAllUsers() {
    console.log('users controller');
    return this.userService.getAllUsers();
  }

  // @Get('/user/:id')
  // getUserById(@Param('id', ParseIntPipe) id: number) {
  //   return this.userService.getUserById(id);
  // }

  @Post()
  createUser(@Body() user: CreateUserDTO) {
    console.log(typeof user);
    console.log(user instanceof CreateUserDTO);
    console.log({ user });
    return this.userService.createUser(user);
  }

  @Patch(':userId')
  updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() user: UpdateUserDTO,
  ) {
    return this.userService.updateUser({
      where: { id: userId },
      data: { ...user },
    });
  }

  @Delete(':userId')
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.deleteUser({ id: userId });
  }
}
