import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

export enum AttachmentType {
  DOCUMENT = 'document',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other',
}

@Entity('task_attachments')
@Index(['task_id'])
@Index(['uploaded_by'])
export class TaskAttachment extends BaseEntity {
  @Column({ name: 'task_id' })
  task_id: number;

  @ManyToOne(() => Task, (task) => task.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'uploaded_by' })
  uploaded_by: number;

  @ManyToOne(() => User, (user) => user.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'uploaded_by' })
  uploaded_by_user: User;

  @Column({ name: 'file_name', length: 500 })
  file_name: string;

  @Column({ name: 'file_url' })
  file_url: string;

  @Column({ name: 'file_size' })
  file_size: number;

  @Column({ name: 'file_type', length: 100 })
  file_type: string;

  @Column({
    type: 'enum',
    enum: AttachmentType,
    enumName: 'attachment_type',
    default: AttachmentType.OTHER,
  })
  attachment_type: AttachmentType;

  @Column({ name: 'mime_type', length: 100, nullable: true })
  mime_type: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'storage_provider', length: 50, default: 'local' })
  storage_provider: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
