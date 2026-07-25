import { useAuth } from '@/store/authHooks';
import { hasPermission } from '@/utils/permissions';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import PageErrorState from './PageErrorState';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission: string;
  fallbackPath?: string;
}

/**
 * Route guard component that checks if user has required permission
 * Shows unauthorized page if permission check fails
 */
export default function PermissionGuard({
  children,
  requiredPermission,
  fallbackPath = '/dashboard',
}: PermissionGuardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user has the required permission
  const hasRequiredPermission = hasPermission(user, requiredPermission);

  if (!hasRequiredPermission) {
    // Show unauthorized page
    return (
      <PageErrorState
        title="Access Denied"
        description="You don't have permission to access this page."
        retryLabel="Go to Dashboard"
        onRetry={() => navigate(fallbackPath)}
      />
    );
  }

  return <>{children}</>;
}
