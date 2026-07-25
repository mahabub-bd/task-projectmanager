export const filterProjects = (projects: any[], searchQuery: string) => {
  if (!searchQuery) return projects;
  const query = searchQuery.toLowerCase();
  return projects.filter((p) =>
    p.name?.toLowerCase().includes(query) ||
    p.description?.toLowerCase().includes(query) ||
    p.status?.toLowerCase().includes(query)
  );
};

export const getProjectStats = (projects: any[], overdueProjects: any[] = []) => {
  const now = new Date();
  const active = projects.filter(p => p.status === 'active').length;
  const completed = projects.filter(p => p.status === 'completed').length;
  const planning = projects.filter(p => p.status === 'planning').length;
  const totalTasks = projects.reduce((sum, p) => sum + (p.tasks?.length || 0), 0);
  const totalMilestones = projects.reduce((sum, p) => sum + (p.milestones?.length || 0), 0);
  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
    : 0;
  return {
    total: projects.length,
    active,
    completed,
    overdue: overdueProjects.length || projects.filter(p => new Date(p.due_date) < now && p.status !== 'completed').length,
    planning,
    totalTasks,
    totalMilestones,
    avgProgress,
  };
};

export const getProjectStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    planning: 'bg-yellow-500',
    active: 'bg-blue-500',
    on_hold: 'bg-orange-500',
    completed: 'bg-green-500',
    cancelled: 'bg-gray-500',
  };
  return colors[status] || 'bg-gray-500';
};

export const getProjectProgress = (project: any): number => {
  if (project.progress !== undefined) return project.progress;
  if (!project.tasks || !project.tasks.length) return 0;
  const completed = project.tasks.filter((t: any) => t.status === 'completed').length;
  return Math.round((completed / project.tasks.length) * 100);
};

export const getRandomProjectColor = (): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
