export const filterPermissions = (permissions: any[], searchQuery: string) => {
  if (!searchQuery) return permissions;
  const query = searchQuery.toLowerCase();
  return permissions.filter((p) =>
    p.name?.toLowerCase().includes(query) ||
    p.description?.toLowerCase().includes(query) ||
    p.resource?.toLowerCase().includes(query) ||
    p.action?.toLowerCase().includes(query)
  );
};
