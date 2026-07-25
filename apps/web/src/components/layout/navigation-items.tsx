import { Building, Building2, CheckSquare, FileText, Flag, FolderKanban, Key, LayoutDashboard, ListChecks, Settings, Shield, Users, Network, BadgeCheck, BookOpen, Bell } from 'lucide-react';
import { NavGroup } from './types';

export const navigationItems: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Notifications', href: '/notifications', icon: Bell },
    ]
  },
  {
    title: 'Work Management',
    items: [
      { name: 'Tasks', href: '/tasks', icon: CheckSquare, requiredPermission: 'read:tasks' },
      { name: 'Projects', href: '/projects', icon: FolderKanban, requiredPermission: 'read:projects' },
      { name: 'Milestones', href: '/milestones', icon: Flag, requiredPermission: 'read:milestones' },
    ]
  },
  {
    title: 'Organization',
    items: [
      { name: 'Users', href: '/users', icon: Users, requiredPermission: 'read:users' },
      { name: 'Address Book', href: '/address-book', icon: BookOpen, requiredPermission: 'read:users' },
      { name: 'Divisions', href: '/divisions', icon: Network, requiredPermission: 'read:divisions' },
      { name: 'Departments', href: '/departments', icon: Building2, requiredPermission: 'read:departments' },
      { name: 'Designations', href: '/designations', icon: BadgeCheck, requiredPermission: 'read:designations' },
      { name: 'Organizations', href: '/organizations', icon: Building, requiredPermission: 'read:organizations' },
    ]
  },
  {
    title: 'Access Control',
    items: [
      { name: 'Roles', href: '/roles', icon: Shield, requiredPermission: 'read:roles' },
      { name: 'Permissions', href: '/permissions', icon: Key, requiredPermission: 'read:permissions' },
      { name: 'Role Permission Matrix', href: '/permissions/by-role', icon: ListChecks, requiredPermission: 'read:permissions' },
      { name: 'Audit Logs', href: '/audit-logs', icon: FileText, requiredPermission: 'read:audit' },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  },
];
