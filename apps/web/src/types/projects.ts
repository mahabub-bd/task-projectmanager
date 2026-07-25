/**
 * Project Types
 */

import type { User } from './auth';

/**
 * Project status values
 */
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';

/**
 * Project priority values
 */
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Project object
 */
export interface Project {
  id: number;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  start_date?: string | null;
  due_date?: string | null;
  color?: string;
  organization_id: number;
  department_id?: number | null;
  department?: any;
  owner_id?: number;
  owner?: User;
  milestones?: any[];
  tasks?: any[];
  tags?: ProjectTag[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Project statistics
 */
export interface ProjectStats {
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  overdue_tasks: number;
  total_milestones: number;
  completed_milestones: number;
  team_members: number;
}

/**
 * Project member
 */
export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  user?: User;
  role?: string;
  joined_at?: string;
}

/**
 * Tag associated with a project
 */
export interface ProjectTag {
  id: number;
  project_id: number;
  tag_id: number;
  tag?: any;
}

/**
 * Create/update project data
 */
export interface ProjectFormData {
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date?: string | null;
  due_date?: string | null;
  color?: string;
  department_id?: string;
}

/**
 * Project filters
 */
export interface ProjectFilters {
  status?: ProjectStatus;
  priority?: ProjectPriority;
  department_id?: number;
  owner_id?: number;
  search?: string;
}
