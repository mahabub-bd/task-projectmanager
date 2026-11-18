import { Circle, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const formatPermissionLabel = (permission: any): string => {
  if (!permission) return '';
  const parts = permission.name?.split('_') || [];
  return parts.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const getPermissionActionBadgeVariant = (action: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    create: 'default',
    read: 'secondary',
    update: 'outline',
    delete: 'destructive',
  };
  return variants[action] || 'secondary';
};

export const getPermissionActionIcon = (action: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    create: Plus,
    read: Eye,
    update: Pencil,
    delete: Trash2,
  };
  return icons[action] || Circle;
};

export const getPermissionResourceBadgeColor = (resource: string): string => {
  const colors: Record<string, string> = {
    users: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    departments: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    projects: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    tasks: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    organizations: 'bg-pink-500/10 text-pink-700 dark:text-pink-300',
    roles: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    permissions: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  };
  return colors[resource] || 'bg-muted text-muted-foreground';
};
