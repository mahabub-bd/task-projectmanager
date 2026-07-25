export const getProjectInitials = (name: string): string => {
  if (!name) return 'NA';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
};

export const getProjectAvatarColor = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-amber-500',
    'bg-red-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const isProjectOverdue = (dueDate: string | Date): boolean => {
  return new Date(dueDate) < new Date();
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

export const getProjectMilestoneCount = (project: any): number => {
  return project.milestones?.length || 0;
};

export const getProjectTaskCount = (project: any): number => {
  return project.tasks?.length || 0;
};

import { format } from 'date-fns';

export const safeFormatProjectDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'No date';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    return format(dateObj, 'MMMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
};
