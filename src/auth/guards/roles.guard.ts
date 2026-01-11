import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/generated/prisma/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface RequestUser {
  id: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //1. What roles are required for this specific route
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    //2. If no roles are required, let them in
    if (!requiredRoles) {
      return true;
    }

    //3. Get the user from the request (we attatched it by JwtStrategy)
    const request = context.switchToHttp().getRequest<{ user: RequestUser }>();
    const user = request.user;

    //4. Check if the user has the required role
    const hasRole = requiredRoles.some((role) => user?.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
