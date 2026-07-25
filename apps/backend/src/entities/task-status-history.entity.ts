import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Task } from './task.entity';
import { TaskStatus } from './tasks.enums';
import { User } from './user.entity';

@Entity('task_status_history')
@Index(['task_id'])
@Index(['changed_by'])
export class TaskStatusHistory extends BaseEntity {
  @Column({ name: 'task_id' })
  task_id: number;

  @ManyToOne(() => Task, (task) => task.status_history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    enumName: 'task_status',
    default: TaskStatus.DRAFT,
  })
  from_status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    enumName: 'task_status',
    default: TaskStatus.OPEN,
  })
  to_status: TaskStatus;

  @Column({ name: 'changed_by' })
  changed_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'changed_by' })
  changed_by_user: User;

  @Column({ type: 'timestamp with time zone' })
  changed_at: Date;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
