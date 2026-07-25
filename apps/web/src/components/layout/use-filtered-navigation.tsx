import { useMemo } from 'react';
import { useAuth } from '@/store/authHooks';
import { hasAnyRole, hasPermission } from '@/utils/permissions';
import { NavGroup } from './types';
import { navigationItems } from './navigation-items';

export function useFilteredNavigation(): NavGroup[] {
  const { user } = useAuth();

  return useMemo(() => {
    return navigationItems
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          // Settings is always visible
          if (item.href === '/settings') return true;

          // Check if user has required permission
          if (item.requiredPermission) {
            return hasPermission(user, item.requiredPermission);
          }

          // Check if user has required role
          if (item.requiredRole) {
            return hasAnyRole(user, [item.requiredRole]);
          }

          // If no permissions/roles required, show the item
          return true;
        }),
      }))
      .filter((group) => group.items.length > 0); // Remove empty groups
  }, [user]);
}
