import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('detail/:userId?')
  async getUserById(
    @Param('userId') userId: string | undefined,
    @Request() req,
  ) {
    // Convert userId to a number only if it's provided
    const userIdNumber = userId ? parseInt(userId, 10) : req.user.id;

    if (isNaN(userIdNumber)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userService.findOne({
      where: { id: userIdNumber },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  @Put(':userId?')
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() user: UpdateUserDTO,
    @Res() response: Response,
    @Query('reauthenticate', new ParseBoolPipe({ optional: true }))
    reauthenticate: boolean = false,
  ) {
    const { links, ...userData } = user;
    const updatedUser = await this.userService.updateUser({
      where: { id: userId },
      data: {
        ...userData,
      },
      reauthenticate,
      include: {
        links: true,
      },
      links,
    });
    if (updatedUser.token) {
      response.cookie('access_token', updatedUser.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
    }
    return response.json(updatedUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.deleteUser({ id: userId });
  }
}
