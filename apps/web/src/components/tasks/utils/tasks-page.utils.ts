export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    low: 'bg-gray-500',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500',
  };
  return colors[priority] || 'bg-gray-500';
};

export const getTaskStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    todo: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    in_review: 'bg-yellow-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
};

export const getTagTextColor = (backgroundColor: string): string => {
  const colorMap: Record<string, string> = {
    'bg-red-500': 'text-red-500',
    'bg-blue-500': 'text-blue-500',
    'bg-green-500': 'text-green-500',
    'bg-yellow-500': 'text-yellow-500',
    'bg-purple-500': 'text-purple-500',
    'bg-pink-500': 'text-pink-500',
    'bg-orange-500': 'text-orange-500',
    'bg-cyan-500': 'text-cyan-500',
    'bg-gray-500': 'text-gray-500',
  };
  return colorMap[backgroundColor] || 'text-gray-500';
};

export const isTaskOverdue = (dueDate: string | Date): boolean => {
  return new Date(dueDate) < new Date();
};

export const getAssignedUsers = (task: any): any[] => {
  if (!task) return [];
  if (task.assignees) return task.assignees;
  if (task.assigned_users) return task.assigned_users;
  if (task.assignments && Array.isArray(task.assignments)) {
    return task.assignments.map((assignment: any) => assignment.user).filter(Boolean);
  }
  return [];
};

export const getRunningDays = (task: any): number => {
  if (!task.created_at) return 0;
  const created = new Date(task.created_at);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
};

export const getTaskTags = (task: any): any[] => {
  return task.tags || [];
};

export const safeFormatDate = (date: string | Date | null | undefined, format?: string): string => {
  if (!date) return 'No date';
  try {
    const d = new Date(date);
    if (format === 'MMM d, yyyy') {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return d.toLocaleDateString();
  } catch {
    return 'Invalid date';
  }
};
