/**
 * Notification & Audit Log Types
 */

/**
 * Notification types
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * Notification object
 */
export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  id?: number;
  user_id: number;
  email_notifications: boolean;
  push_notifications: boolean;
  task_assigned: boolean;
  task_updated: boolean;
  task_completed: boolean;
  milestone_due: boolean;
  project_updated: boolean;
  comment_added: boolean;
}

/**
 * Update notification preferences data
 */
export interface NotificationPreferencesUpdate {
  email_notifications?: boolean;
  push_notifications?: boolean;
  task_assigned?: boolean;
  task_updated?: boolean;
  task_completed?: boolean;
  milestone_due?: boolean;
  project_updated?: boolean;
  comment_added?: boolean;
}

/**
 * Audit log object
 */
export interface AuditLog {
  id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  user_id: number;
  user?: {
    name: string;
    email: string;
  };
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  description?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

/**
 * Audit log filters
 */
export interface AuditLogFilters {
  user_id?: number;
  action?: string;
  entity_type?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}
