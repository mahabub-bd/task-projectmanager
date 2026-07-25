import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Department } from './department.entity';
import { Project } from './project.entity';
import { TaskAssignment } from './task-assignment.entity';
import { TaskAttachment } from './task-attachment.entity';
import { TaskComment } from './task-comment.entity';
import { TaskStatusHistory } from './task-status-history.entity';
import { TaskTag } from './task-tag.entity';
import { TaskPriority, TaskStatus } from './tasks.enums';
import { User } from './user.entity';

@Entity('tasks')
@Index(['created_by'])
@Index(['department_id'])
@Index(['project_id'])
@Index(['status'])
@Index(['priority'])
@Index(['due_date'])
export class Task extends BaseEntity {
  @Column({ length: 500 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    enumName: 'task_status',
    default: TaskStatus.DRAFT,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    enumName: 'task_priority',
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({ name: 'department_id', nullable: true })
  department_id: number | null;

  @ManyToOne(() => Department, (department) => department.tasks, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'department_id' })
  department: Department | null;

  @Column({ name: 'project_id', nullable: true })
  project_id: number | null;

  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project | null;

  @Column({ name: 'created_by' })
  created_by: number;

  @ManyToOne(() => User, (user) => user.created_tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  created_by_user: User;

  @Column({ name: 'assigned_to', nullable: true })
  assigned_to: number | null;

  @ManyToOne(() => User, (user) => user.assigned_tasks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'assigned_to' })
  assigned_to_user: User | null;

  @Column({ name: 'due_date', type: 'timestamp with time zone', nullable: true })
  due_date: Date | null;

  @Column({ name: 'start_date', type: 'timestamp with time zone', nullable: true })
  start_date: Date | null;

  @Column({ name: 'completed_at', type: 'timestamp with time zone', nullable: true })
  completed_at: Date | null;

  @Column({ name: 'estimated_hours', type: 'decimal', precision: 5, scale: 2, nullable: true })
  estimated_hours: number | null;

  @Column({ name: 'actual_hours', type: 'decimal', precision: 5, scale: 2, nullable: true })
  actual_hours: number | null;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column({ name: 'parent_task_id', nullable: true })
  parent_task_id: number | null;

  @ManyToOne(() => Task, (task) => task.subtasks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_task_id' })
  parent_task: Task | null;

  @OneToMany(() => Task, (task) => task.parent_task)
  subtasks: Task[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ name: 'attachment_count', default: 0 })
  attachment_count: number;

  @Column({ name: 'comment_count', default: 0 })
  comment_count: number;

  @OneToMany(() => TaskAssignment, (assignment) => assignment.task)
  assignments: TaskAssignment[];

  @OneToMany(() => TaskComment, (comment) => comment.task)
  comments: TaskComment[];

  @OneToMany(() => TaskAttachment, (attachment) => attachment.task)
  attachments: TaskAttachment[];

  @OneToMany(() => TaskStatusHistory, (history) => history.task)
  status_history: TaskStatusHistory[];

  @OneToMany(() => TaskTag, (taskTag) => taskTag.task)
  tags: TaskTag[];
}
