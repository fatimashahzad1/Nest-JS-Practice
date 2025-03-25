import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserType } from '@prisma/client';

@Injectable()
export class CompanyAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if the user exists and has a userType of "COMPANY"
    if (user && user.userType === UserType.COMPANY) {
      return true; // Allow the request to proceed
    }

    // If the user is not authorized, throw a ForbiddenException
    throw new ForbiddenException('User is not authorized');
  }
}
