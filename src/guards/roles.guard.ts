import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/constants';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log({ requiredRoles });
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log({ user });
    // Authorization logic based on `isAdmin` boolean field
    // If `isAdmin` is true, grant access regardless of required roles
    if (user.isAdmin) {
      console.log('Access granted: user is an admin');
      return true;
    }
    return false;
  }
}
