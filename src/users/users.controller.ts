import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { StatusDTO } from './dtos/status.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':isMarried?')
  getUsers(
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number,
    @Param() param: StatusDTO,
  ) {
    console.log({ param });
    return this.userService.getAllUsers(limit);
  }

  @Get('/user/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  createUser(@Body() user: CreateUserDTO) {
    console.log(typeof user);
    console.log(user instanceof CreateUserDTO);
    console.log({ user });
    return this.userService.createUser(user);
  }

  @Patch()
  updateUser(@Body() user: UpdateUserDTO) {
    console.log({ user });
    return user;
  }
}
