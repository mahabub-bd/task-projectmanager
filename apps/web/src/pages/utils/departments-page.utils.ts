export const filterDepartments = (departments: any[], searchQuery: string) => {
  if (!searchQuery) return departments;
  const query = searchQuery.toLowerCase();
  return departments.filter((dept) =>
    dept.name?.toLowerCase().includes(query) ||
    dept.description?.toLowerCase().includes(query)
  );
};

export const getDepartmentStats = (departments: any[]) => {
  return {
    total: departments.length,
    active: departments.filter(d => d.is_active).length,
    withParent: departments.filter(d => d.parent_id).length,
    root: departments.filter(d => !d.parent_id).length,
    child: departments.filter(d => d.parent_id).length,
  };
};
