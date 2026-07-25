/**
 * Task Types
 */

import type { User } from './auth';

/**
 * Task status values
 */
export type TaskStatus = 'draft' | 'open' | 'in_progress' | 'review' | 'completed' | 'closed';

/**
 * Task priority values
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Task object
 */
export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  due_date?: string | null;
  color?: string;
  project_id?: number | null;
  project?: any;
  milestone_id?: number | null;
  milestone?: any;
  assigned_to_user?: User;
  assignments?: TaskAssignment[];
  tags?: TaskTag[];
  tag_ids?: number[];
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  status_history?: TaskStatusHistory[];
}

/**
 * Task assignment to users
 */
export interface TaskAssignment {
  id: number;
  task_id: number;
  user_id: number;
  user?: User;
  assigned_by: number;
  notes?: string;
  created_at?: string;
}

/**
 * Tag associated with a task
 */
export interface TaskTag {
  id: number;
  task_id: number;
  tag_id: number;
  tag?: Tag;
}

/**
 * Tag
 */
export interface Tag {
  id: number;
  name: string;
  color: string;
  organization_id: number;
}

/**
 * Task status history
 */
export interface TaskStatusHistory {
  id: number;
  task_id: number;
  from_status: string;
  to_status: string;
  changed_by: number;
  changed_by_user?: User;
  changed_at: string;
}

/**
 * Task comment
 */
export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  user?: User;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Create/update task data
 */
export interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  progress?: number;
  project_id?: string;
  milestone_id?: string;
  tag_ids?: number[];
}

/**
 * Task filters
 */
export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: number;
  milestone_id?: number;
  assigned_to?: number;
  search?: string;
}

/**
 * Task query params
 */
export interface TaskQueryParams extends TaskFilters {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
