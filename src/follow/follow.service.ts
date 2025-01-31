import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  // Follow a user
  async followUser(currentUserId: number, userId: number) {
    if (currentUserId === userId) {
      throw new Error('You cannot follow yourself');
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create follow entry
    await this.prisma.follow.create({
      data: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    return {
      success: 'Success',
      statusCode: HttpStatus.OK,
      message: 'Followed user successfully',
    };
  }

  // Unfollow a user
  async unfollowUser(currentUserId: number, userId: number) {
    // Check if follow relationship exists
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    // Delete follow entry
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    return {
      success: 'Success',
      statusCode: HttpStatus.OK,
      message: 'Unfollowed user successfully',
    };
  }

  // Get all users with follow status
  async getAllUsersWithFollowStatus(currentUserId: number) {
    const users = await this.prisma.user.findMany({
      where: { id: { not: currentUserId } },
      include: {
        following: {
          where: { followerId: currentUserId },
          select: { follower: true },
        },
      },
    });
    return {
      people: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isFollowedByCurrentUser: user.following.length > 0,
      })),
    };
  }

  //get users by the search
  async getSearchedUsers(params: {
    currentUserId: number;
    searchString: string;
  }) {
    const { currentUserId, searchString } = params;
    const users = await this.prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        OR: [
          {
            name: { contains: searchString, mode: 'insensitive' },
          },
        ],
      },
      include: {
        following: {
          where: { followerId: currentUserId },
          select: { follower: true },
        },
      },
    });
    return {
      people: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isFollowedByCurrentUser: user.following.length > 0,
      })),
    };
  }
}
