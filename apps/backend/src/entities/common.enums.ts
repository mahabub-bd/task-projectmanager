export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_UPDATED = 'task_updated',
  TASK_COMPLETED = 'task_completed',
  TASK_OVERDUE = 'task_overdue',
  PROJECT_CREATED = 'project_created',
  PROJECT_UPDATED = 'project_updated',
  MILESTONE_DUE = 'milestone_due',
  MILESTONE_COMPLETED = 'milestone_completed',
  COMMENT_ADDED = 'comment_added',
  MENTION = 'mention',
  ROLE_UPDATED = 'role_updated',
  DEPARTMENT_UPDATED = 'department_updated',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  DELIVERED = 'delivered',
}
