export const filterTasks = (tasks: any[], searchQuery: string) => {
  if (!searchQuery) return tasks;
  const query = searchQuery.toLowerCase();
  return tasks.filter((t) =>
    t.title?.toLowerCase().includes(query) ||
    t.description?.toLowerCase().includes(query)
  );
};

export const getTaskStats = (tasks: any[]) => {
  const now = new Date();
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  return {
    total,
    completed,
    overdue: tasks.filter(t => new Date(t.due_date) < now && t.status !== 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completionRate,
  };
};

export const getAssignedUsers = (task: any): any[] => {
  if (!task) return [];
  if (task.assignees) return task.assignees;
  if (task.assigned_users) return task.assigned_users;
  return [];
};
