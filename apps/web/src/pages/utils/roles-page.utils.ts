export const filterRoles = (roles: any[], searchQuery: string) => {
  if (!searchQuery) return roles;
  const query = searchQuery.toLowerCase();
  return roles.filter((r) =>
    r.name?.toLowerCase().includes(query) ||
    r.description?.toLowerCase().includes(query)
  );
};

export const getRoleStats = (roles: any[]) => {
  const totalPermissions = roles.reduce((sum, r) => sum + (r.permissions?.length || 0), 0);
  return {
    total: roles.length,
    withUsers: roles.filter(r => r.user_count && r.user_count > 0).length,
    withPermissions: roles.filter(r => r.permissions && r.permissions.length > 0).length,
    withoutPermissions: roles.filter(r => !r.permissions || r.permissions.length === 0).length,
    totalPermissions,
  };
};
