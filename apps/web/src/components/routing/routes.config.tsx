import DashboardPage from '@/pages/DashboardPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import React, { lazy } from 'react';

// Eager (critical)


// Lazy pages
const TasksPage = lazy(() => import('@/pages/TasksPage'));
const TaskDetailsPage = lazy(() => import('@/pages/TaskDetailsPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const ProjectDetailsPage = lazy(() => import('@/pages/ProjectDetailsPage'));
const MilestonesPage = lazy(() => import('@/pages/MilestonesPage'));
const MilestoneDetailsPage = lazy(() => import('@/pages/MilestoneDetailsPage'));
const UsersPage = lazy(() => import('@/pages/UsersPage'));
const AddressBookPage = lazy(() => import('@/pages/AddressBookPage'));
const DivisionsPage = lazy(() => import('@/pages/DivisionsPage'));
const DepartmentsPage = lazy(() => import('@/pages/DepartmentsPage'));
const DesignationsPage = lazy(() => import('@/pages/DesignationsPage'));
const OrganizationsPage = lazy(() => import('@/pages/OrganizationsPage'));
const OrganizationDetailsPage = lazy(() => import('@/pages/OrganizationDetailsPage'));
const RolesPage = lazy(() => import('@/pages/RolesPage'));
const RolePermissionsPage = lazy(() => import('@/pages/RolePermissionsPage'));
const PermissionsPage = lazy(() => import('@/pages/PermissionsPage'));
const PermissionsByRolePage = lazy(() => import('@/pages/PermissionsByRolePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AuditLogsPage = lazy(() => import('@/pages/AuditLogsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));

export interface AppRoute {
  path: string;
  element: React.ReactElement;
  isPublic?: boolean;
  permission?: string;
}

export const routes: AppRoute[] = [
  // Public routes
  { path: '/login', element: <LoginPage />, isPublic: true },
  { path: '/register', element: <RegisterPage />, isPublic: true },
  { path: '/forgot-password', element: <ForgotPasswordPage />, isPublic: true },
  { path: '/reset-password', element: <ResetPasswordPage />, isPublic: true },

  // Protected routes
  { path: '/', element: <DashboardPage /> },
  { path: '/dashboard', element: <DashboardPage /> },

  { path: '/tasks', element: <TasksPage />, permission: 'read:tasks' },
  { path: '/tasks/:taskId', element: <TaskDetailsPage />, permission: 'read:tasks' },

  { path: '/users', element: <UsersPage />, permission: 'read:users' },
  { path: '/address-book', element: <AddressBookPage />, permission: 'read:users' },
  { path: '/divisions', element: <DivisionsPage />, permission: 'read:divisions' },
  { path: '/departments', element: <DepartmentsPage />, permission: 'read:departments' },
  { path: '/designations', element: <DesignationsPage />, permission: 'read:designations' },

  { path: '/milestones', element: <MilestonesPage />, permission: 'read:milestones' },
  { path: '/milestones/:milestoneId', element: <MilestoneDetailsPage />, permission: 'read:milestones' },

  { path: '/projects', element: <ProjectsPage />, permission: 'read:projects' },
  { path: '/projects/:projectId', element: <ProjectDetailsPage />, permission: 'read:projects' },

  { path: '/organizations', element: <OrganizationsPage />, permission: 'read:organizations' },
  { path: '/organizations/:id', element: <OrganizationDetailsPage />, permission: 'read:organizations' },

  { path: '/roles', element: <RolesPage />, permission: 'read:roles' },
  { path: '/roles/:roleId/permissions', element: <RolePermissionsPage />, permission: 'read:roles' },

  { path: '/permissions', element: <PermissionsPage />, permission: 'read:permissions' },
  { path: '/permissions/by-role', element: <PermissionsByRolePage />, permission: 'read:permissions' },

  { path: '/settings', element: <SettingsPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/notifications', element: <NotificationsPage /> },
  { path: '/audit-logs', element: <AuditLogsPage />, permission: 'read:audit' },
]; 