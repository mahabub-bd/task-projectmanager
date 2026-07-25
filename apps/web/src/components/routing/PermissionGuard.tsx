import { useAppSelector } from '@/store/store';
import { Navigate } from 'react-router-dom';
import { hasPermission } from '@/utils/permissions';

/**
 * Props for PermissionGuard component
 */
interface PermissionGuardProps {
  /** Child element to render if permission check passes */
  children: React.ReactElement;
  /** Permission string required to access the route */
  requiredPermission: string;
  /** Path to redirect to if permission check fails */
  fallbackPath?: string;
}

/**
 * Route guard component that checks if the current user has the required permission.
 * Redirects to fallbackPath if the user lacks the permission.
 *
 * @example
 * ```tsx
 * <PermissionGuard requiredPermission="read:users" fallbackPath="/dashboard">
 *   <UsersPage />
 * </PermissionGuard>
 * ```
 */
export function PermissionGuard({
  children,
  requiredPermission,
  fallbackPath = '/dashboard',
}: PermissionGuardProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (!hasPermission(user, requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}

export default PermissionGuard;