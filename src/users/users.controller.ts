import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { StatusDTO } from './dtos/status.dto';

@Controller('users')
export class UsersController {
  @Get(':isMarried?')
  getUsers(
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number,
    @Param() param: StatusDTO,
  ) {
    console.log({ param });
    const userService = new UsersService();
    return userService.getAllUsers(limit);
  }

  @Get('/user/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const userService = new UsersService();
    return userService.getUserById(id);
  }

  @Post()
  createUser(@Body() user: CreateUserDTO) {
    console.log(typeof user);
    console.log(user instanceof CreateUserDTO);
    console.log({ user });
    const userService = new UsersService();
    return userService.createUser(user);
  }
}
