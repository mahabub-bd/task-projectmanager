export const filterMilestones = (milestones: any[], searchQuery: string) => {
  if (!searchQuery) return milestones;
  const query = searchQuery.toLowerCase();
  return milestones.filter((m) =>
    m.name?.toLowerCase().includes(query) ||
    m.description?.toLowerCase().includes(query)
  );
};

export const getMilestoneStats = (milestones: any[], overdueMilestones: any[] = []) => {
  const now = new Date();
  const inProgress = milestones.filter(m => m.status === 'in_progress').length;
  const avgProgress = milestones.length > 0
    ? Math.round(milestones.reduce((sum, m) => sum + (m.progress || 0), 0) / milestones.length)
    : 0;
  return {
    total: milestones.length,
    completed: milestones.filter(m => m.status === 'completed').length,
    overdue: overdueMilestones.length || milestones.filter(m => new Date(m.due_date) < now && m.status !== 'completed').length,
    upcoming: milestones.filter(m => new Date(m.due_date) > now && m.status !== 'completed').length,
    inProgress,
    avgProgress,
  };
};

export const getMilestoneStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-gray-500',
  };
  return colors[status] || 'bg-gray-500';
};

export const getMilestoneProgress = (milestone: any): number => {
  if (!milestone.tasks || !milestone.tasks.length) return milestone.progress || 0;
  const completed = milestone.tasks.filter((t: any) => t.status === 'completed').length;
  return Math.round((completed / milestone.tasks.length) * 100);
};

export const buildMilestonePayload = (formData: any, organizationId?: number) => {
  return {
    name: formData.name,
    description: formData.description,
    due_date: formData.due_date,
    project_id: formData.project_id,
    organization_id: organizationId,
    status: formData.status || 'pending',
    progress: formData.progress || 0,
  };
};

export const buildMilestoneUpdatePayload = (formData: any) => {
  const payload: any = {};
  if (formData.name !== undefined) payload.name = formData.name;
  if (formData.description !== undefined) payload.description = formData.description;
  // Only include date fields if they have a value (not empty string)
  if (formData.start_date) payload.start_date = formData.start_date;
  if (formData.end_date) payload.end_date = formData.end_date;
  if (formData.due_date) payload.due_date = formData.due_date;
  if (formData.project_id !== undefined) payload.project_id = formData.project_id;
  if (formData.status !== undefined) payload.status = formData.status;
  if (formData.progress !== undefined) payload.progress = formData.progress;
  if (formData.color !== undefined) payload.color = formData.color;
  return payload;
};

export const getRandomMilestoneColor = (): string => {
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
