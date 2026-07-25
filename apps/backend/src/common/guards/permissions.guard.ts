import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get all permissions from user's roles
    const userPermissions = new Set<string>();

    user.user_roles?.forEach((ur: any) => {
      ur.role.permissions?.forEach((permission: any) => {
        // Add the permission name directly (handles organizations: read:organizations)
        userPermissions.add(permission.name.trim());

        // Also add swapped format (handles other modules: users:read)
        const parts = permission.name.split(':');
        if (parts.length === 2) {
          const [action, resource] = parts;
          // Trim whitespace and swap to resource:action format
          userPermissions.add(`${resource.trim()}:${action.trim()}`);
        }
      });
    });

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Missing required permissions: ${requiredPermissions.join(', ')}`,
      );
    }
    return true;
  }
}
