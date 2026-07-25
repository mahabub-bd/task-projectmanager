export const filterOrganizations = (organizations: any[], searchQuery: string) => {
  if (!searchQuery) return organizations;
  const query = searchQuery.toLowerCase();
  return organizations.filter((org) =>
    org.name?.toLowerCase().includes(query) ||
    org.description?.toLowerCase().includes(query)
  );
};

export const getOrganizationStats = (organizations: any[]) => {
  return {
    total: organizations.length,
    active: organizations.filter(o => o.is_active).length,
    withEmail: organizations.filter(o => o.email).length,
    withPhone: organizations.filter(o => o.phone).length,
    withWebsite: organizations.filter(o => o.website).length,
  };
};
