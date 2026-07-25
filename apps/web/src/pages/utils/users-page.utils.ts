export const filterUsers = (users: any[], searchQuery: string) => {
  if (!searchQuery) return users;
  const query = searchQuery.toLowerCase();
  return users.filter((u) =>
    u.name?.toLowerCase().includes(query) ||
    u.email?.toLowerCase().includes(query)
  );
};

export const getUserStats = (users: any[]) => {
  return {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    pending: users.filter(u => !u.is_active && u.status === 'pending').length,
  };
};
