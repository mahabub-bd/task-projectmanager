import { useLocation } from 'react-router-dom';
import { Breadcrumb } from './types';

export function useBreadcrumbs(): Breadcrumb[] {
  const location = useLocation();

  const getBreadcrumbs = (): Breadcrumb[] => {
    const breadcrumbs: Breadcrumb[] = [{ label: 'Dashboard', href: '/dashboard' }];

    if (location.pathname === '/dashboard') {
      return [{ label: 'Dashboard', href: '/dashboard' }];
    }

    // Work Management
    if (location.pathname.startsWith('/tasks')) {
      breadcrumbs.push({ label: 'Tasks', href: '/tasks' });
      if (location.pathname.startsWith('/tasks/') && location.pathname !== '/tasks') {
        breadcrumbs.push({ label: 'Task Details', href: location.pathname });
      }
    } else if (location.pathname.startsWith('/projects')) {
      breadcrumbs.push({ label: 'Projects', href: '/projects' });
      if (location.pathname.startsWith('/projects/') && location.pathname !== '/projects') {
        breadcrumbs.push({ label: 'Project Details', href: location.pathname });
      }
    } else if (location.pathname.startsWith('/phases/')) {
      breadcrumbs.push({ label: 'Projects', href: '/projects' });
      breadcrumbs.push({ label: 'Phase Details', href: location.pathname });
    } else if (location.pathname.startsWith('/milestones')) {
      breadcrumbs.push({ label: 'Milestones', href: '/milestones' });
    }

    // Organization
    else if (location.pathname.startsWith('/users')) {
      breadcrumbs.push({ label: 'Users', href: '/users' });
    } else if (location.pathname.startsWith('/address-book')) {
      breadcrumbs.push({ label: 'Address Book', href: '/address-book' });
    } else if (location.pathname.startsWith('/departments')) {
      breadcrumbs.push({ label: 'Departments', href: '/departments' });
    } else if (location.pathname.startsWith('/organizations')) {
      breadcrumbs.push({ label: 'Organizations', href: '/organizations' });
      if (location.pathname.startsWith('/organizations/') && location.pathname !== '/organizations') {
        breadcrumbs.push({ label: 'Organization Details', href: location.pathname });
      }
    }

    // Access Control
    else if (location.pathname.startsWith('/roles')) {
      breadcrumbs.push({ label: 'Roles', href: '/roles' });
      if (location.pathname.startsWith('/roles/') && location.pathname !== '/roles') {
        breadcrumbs.push({ label: 'Manage Permissions', href: location.pathname });
      }
    } else if (location.pathname.startsWith('/permissions')) {
      breadcrumbs.push({ label: 'Permissions', href: '/permissions' });
      if (location.pathname === '/permissions/by-role') {
        breadcrumbs.push({ label: 'Role Permission Matrix', href: '/permissions/by-role' });
      }
    } else if (location.pathname.startsWith('/audit-logs')) {
      breadcrumbs.push({ label: 'Audit Logs', href: '/audit-logs' });
    } else if (location.pathname.startsWith('/settings')) {
      breadcrumbs.push({ label: 'Settings', href: '/settings' });
    }

    return breadcrumbs;
  };

  return getBreadcrumbs();
}
