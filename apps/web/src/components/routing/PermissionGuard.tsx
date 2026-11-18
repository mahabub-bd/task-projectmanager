import { useAppSelector } from '@/store/store';
import { hasPermission } from '@/utils/permissions';
import { Navigate } from 'react-router-dom';

/**
 * Props for PermissionGuard component
 */
interface PermissionGuardProps {
  children: React.ReactElement;
  requiredPermission: string;
  fallbackPath?: string;
}

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