export const isMilestoneOverdue = (dueDate: string | Date): boolean => {
  return new Date(dueDate) < new Date();
};

import { format } from 'date-fns';

export const safeFormatMilestoneDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'No date';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    return format(dateObj, 'MMMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
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


