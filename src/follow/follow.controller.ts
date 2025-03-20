import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  Delete,
  Get,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ParseStringPipe } from 'src/post/pipes/ParseStringPipe.pipe';
import { GetUnfollowedUsersDto } from './dto/get-unfollowed-users.dto';

@Controller('people')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  // Route to follow a user
  @Post('/follow/:userId')
  async followUser(@Param('userId') userId: number, @Request() req) {
    const currentUserId = req.user.id; // Extract current logged-in user's ID from JWT payload
    return this.followService.followUser(currentUserId, userId);
  }

  // Route to unfollow a user
  @Delete('/unfollow/:userId')
  async unfollowUser(@Param('userId') userId: number, @Request() req) {
    const currentUserId = req.user.id;
    return this.followService.unfollowUser(currentUserId, userId);
  }

  // Route to fetch all users with follow status
  @Get()
  async getAllUsersWithFollowStatus(@Request() req) {
    const currentUserId = req.user.id; // Extract current logged-in user's ID from JWT payload
    return this.followService.getAllUsersWithFollowStatus(currentUserId);
  }

  @Get('/follow')
  async getAllFollowedUSers(@Request() req) {
    const currentUserId = req.user.id; // Extract current logged-in user's ID from JWT payload
    return this.followService.getAllFollowedUsers(currentUserId);
  }

  @Get('/unfollow')
  @UsePipes(new ValidationPipe({ transform: true })) // Enables DTO validation & transformation
  async getAllUnFollowedUSers(
    @Request() req,
    @Query() query: GetUnfollowedUsersDto,
  ) {
    const currentUserId = req.user.id; // Extract current logged-in user's ID from JWT payload
    const count = query.count ?? 3;
    return this.followService.getAllUnFollowedUsers(currentUserId, count);
  }

  @Get('/search')
  async getFilteredPosts(
    @Query('searchString', ParseStringPipe) searchString: string,
    @Request() req,
  ): Promise<any> {
    const currentUserId = req.user.id;
    return this.followService.getSearchedUsers({
      currentUserId,
      searchString,
    });
  }
}
