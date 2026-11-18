import { Bell, BookOpen, Building2, CheckCircle2, FolderKanban, Flag, Gauge, KeyRound, Layers, ListChecks, ScrollText, Settings2, ShieldCheck, UserRound, UsersRound } from 'lucide-react';
import { NavGroup } from './types';

export const navigationItems: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Gauge },
      { name: 'Notifications', href: '/notifications', icon: Bell },
    ]
  },
  {
    title: 'Work Management',
    items: [
      { name: 'Tasks', href: '/tasks', icon: CheckCircle2, requiredPermission: 'read:tasks' },
      { name: 'Projects', href: '/projects', icon: FolderKanban, requiredPermission: 'read:projects' },
      { name: 'Milestones', href: '/milestones', icon: Flag, requiredPermission: 'read:milestones' },
    ]
  },
  {
    title: 'Organization',
    items: [
      { name: 'Users', href: '/users', icon: UsersRound, requiredPermission: 'read:users' },
      { name: 'Address Book', href: '/address-book', icon: BookOpen, requiredPermission: 'read:users' },
      { name: 'Divisions', href: '/divisions', icon: Layers, requiredPermission: 'read:divisions' },
      { name: 'Departments', href: '/departments', icon: Building2, requiredPermission: 'read:departments' },
      { name: 'Designations', href: '/designations', icon: UserRound, requiredPermission: 'read:designations' },
      { name: 'Organizations', href: '/organizations', icon: Building2, requiredPermission: 'read:organizations' },
    ]
  },
  {
    title: 'Access Control',
    items: [
      { name: 'Roles', href: '/roles', icon: ShieldCheck, requiredPermission: 'read:roles' },
      { name: 'Permissions', href: '/permissions', icon: KeyRound, requiredPermission: 'read:permissions' },
      { name: 'Role Permission', href: '/permissions/by-role', icon: ListChecks, requiredPermission: 'read:permissions' },
      { name: 'Audit Logs', href: '/audit-logs', icon: ScrollText, requiredPermission: 'read:audit' },
      { name: 'Settings', href: '/settings', icon: Settings2 },
    ]
  },
];
