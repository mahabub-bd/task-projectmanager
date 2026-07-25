/**
 * Milestone Types
 */

/**
 * Milestone status values
 */
export type MilestoneStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Milestone object
 */
export interface Milestone {
  id: number;
  title: string;
  description?: string | null;
  status: MilestoneStatus;
  progress: number;
  due_date?: string | null;
  color?: string;
  project_id?: number | null;
  project?: any;
  start_date?: string | null;
  tasks?: any[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Create/update milestone data
 */
export interface MilestoneFormData {
  title: string;
  description?: string;
  status: MilestoneStatus;
  due_date?: string | null;
  project_id?: string;
  color?: string;
}

/**
 * Milestone filters
 */
export interface MilestoneFilters {
  status?: MilestoneStatus;
  project_id?: number;
  search?: string;
}
