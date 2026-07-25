import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { NotificationStatus, NotificationType, NotificationPriority } from './common.enums';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity('notifications')
@Index(['user_id'])
@Index(['read_at'])
@Index(['created_at'])
@Index(['organization_id'])
export class Notification extends BaseEntity {
  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
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
    enumName: 'notification_type',
  })
  type: NotificationType;

  @Column({ length: 500 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority;

  @Column({ name: 'entity_type', length: 100, nullable: true })
  entity_type: string | null;

  @Column({ name: 'entity_id', nullable: true })
  entity_id: number | null;

  @Column({ name: 'related_entity_type', length: 100, nullable: true })
  related_entity_type: string | null;

  @Column({ name: 'related_entity_id', nullable: true })
  related_entity_id: number | null;

  @Column({ name: 'action_url', length: 500, nullable: true })
  action_url: string | null;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    enumName: 'notification_status',
    default: NotificationStatus.SENT,
  })
  status: NotificationStatus;

  @Column({ name: 'read_at', type: 'timestamp with time zone', nullable: true })
  read_at: Date | null;

  @Column({ name: 'delivered_at', type: 'timestamp with time zone', nullable: true })
  delivered_at: Date | null;

  @Column({ name: 'expires_at', type: 'timestamp with time zone', nullable: true })
  expires_at: Date | null;

  @Column({ default: false })
  is_email_sent: boolean;

  @Column({ name: 'email_sent_at', type: 'timestamp with time zone', nullable: true })
  email_sent_at: Date | null;

  @Column({ default: false })
  is_push_sent: boolean;

  @Column({ name: 'push_sent_at', type: 'timestamp with time zone', nullable: true })
  push_sent_at: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
