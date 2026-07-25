export const getPermissionCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    users: 'bg-blue-500',
    departments: 'bg-green-500',
    projects: 'bg-purple-500',
    tasks: 'bg-orange-500',
    organizations: 'bg-pink-500',
    roles: 'bg-cyan-500',
    permissions: 'bg-amber-500',
    audit_logs: 'bg-gray-500',
  };
  return colors[category] || 'bg-gray-500';
};

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

export const getPermissionActionIcon = (action: string): string => {
  const icons: Record<string, string> = {
    create: '➕',
    read: '👁️',
    update: '✏️',
    delete: '🗑️',
  };
  return icons[action] || '•';
};

export const getPermissionAvatarColor = (permission: any): string => {
  return getPermissionCategoryColor(permission.category || 'other');
};

export const getPermissionResourceBadgeColor = (resource: string): string => {
  const colors: Record<string, string> = {
    users: 'bg-blue-100 text-blue-800',
    departments: 'bg-green-100 text-green-800',
    projects: 'bg-purple-100 text-purple-800',
    tasks: 'bg-orange-100 text-orange-800',
    organizations: 'bg-pink-100 text-pink-800',
  };
  return colors[resource] || 'bg-gray-100 text-gray-800';
};
