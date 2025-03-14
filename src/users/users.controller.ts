import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';

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
    const { password, ...safeUser } = user;
    return safeUser;
  }

  @Patch(':userId?')
  updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() user: UpdateUserDTO,
  ) {
    return this.userService.updateUser({
      where: { id: userId },
      data: {
        ...user,
        links: user.links
          ? {
              // Transform the links array into the structure expected by Prisma
              upsert: user.links.map((link) => ({
                where: { id: userId || -1 }, // Use a dummy ID if no ID is provided
                update: { platform: link.platform, url: link.url },
                create: { platform: link.platform, url: link.url },
              })),
            }
          : undefined, // If no links are provided, set to undefined
      },
    });
  }

  @Delete(':userId')
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.deleteUser({ id: userId });
  }
}
