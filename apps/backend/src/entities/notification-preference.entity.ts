import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_UPDATED = 'task_updated',
  TASK_COMMENT = 'task_comment',
  TASK_DUE_SOON = 'task_due_soon',
  TASK_OVERDUE = 'task_overdue',
  TASK_COMPLETED = 'task_completed',
  PROJECT_CREATED = 'project_created',
  PROJECT_UPDATED = 'project_updated',
  MILESTONE_COMPLETED = 'milestone_completed',
  MILESTONE_DUE_SOON = 'milestone_due_soon',
}

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'organization_id' })
  organization_id: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({
    type: 'enum',
    enum: NotificationType,
    name: 'notification_type',
  })
  notification_type: NotificationType;

  @Column({
    name: 'email_enabled',
    default: true,
  })
  email_enabled: boolean;

  @Column({
    name: 'in_app_enabled',
    default: true,
  })
  in_app_enabled: boolean;

  @Column({
    name: 'reminder_hours',
    type: 'int',
    default: 24,
    comment: 'Hours before due date to send reminder',
  })
  reminder_hours: number;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
