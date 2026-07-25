import { useAppSelector } from '@/store/store';
import { Navigate } from 'react-router-dom';
import Layout from '../Layout';
import PermissionGuard from '../PermissionGuard';


interface Props {
  children: React.ReactElement;
  isPublic?: boolean;
  permission?: string;
}

export default function RouteWrapper({ children, isPublic, permission }: Props) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Public route
  if (isPublic) {
    return children;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  let content = children;

  // Permission check
  if (permission) {
    content = (
      <PermissionGuard requiredPermission={permission}>
        {children}
      </PermissionGuard>
    );
  }

  return <Layout>{content}</Layout>;
}