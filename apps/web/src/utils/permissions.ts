import type { User } from '@/types/auth';

/**
 * Flatten all permissions from user's roles
 */
export const getUserPermissions = (user: User | null): string[] => {
  if (!user?.roles || user.roles.length === 0) {
    return [];
  }

  const permissions = new Set<string>();

  user.roles.forEach((role) => {
    if (role?.permissions) {
      role.permissions.forEach((permission) => {
        if (permission?.name) {
          permissions.add(permission.name);
        }
      });
    }
  });

  return Array.from(permissions);
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (user: User | null, permissionName: string): boolean => {
  const permissions = getUserPermissions(user);
  return permissions.includes(permissionName);
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (user: User | null, permissionNames: string[]): boolean => {
  const permissions = getUserPermissions(user);
  return permissionNames.some((permission) => permissions.includes(permission));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (user: User | null, permissionNames: string[]): boolean => {
  const permissions = getUserPermissions(user);
  return permissionNames.every((permission) => permissions.includes(permission));
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null, roleName: string): boolean => {
  if (!user?.roles || user.roles.length === 0) {
    return false;
  }
  return user.roles.some((role) => role?.name === roleName);
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roleNames: string[]): boolean => {
  if (!user?.roles || user.roles.length === 0) {
    return false;
  }
  return roleNames.some((roleName) => user.roles?.some((role) => role?.name === roleName));
};
