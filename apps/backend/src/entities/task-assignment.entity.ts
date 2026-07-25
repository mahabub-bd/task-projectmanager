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

@Entity('task_assignments')
@Index(['task_id'])
@Index(['user_id'])
export class TaskAssignment extends BaseEntity {
  @Column({ name: 'task_id' })
  task_id: number;

  @ManyToOne(() => Task, (task) => task.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.assigned_tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'assigned_by' })
  assigned_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_by' })
  assigned_by_user: User;

  @Column({ type: 'timestamp with time zone' })
  assigned_at: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
