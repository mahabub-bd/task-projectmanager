import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Milestone } from './milestone.entity';
import { Organization } from './organization.entity';
import { Phase } from './phase.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectStatusHistory } from './project-status-history.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('projects')
@Index(['organization_id'])
@Index(['status'])
@Index(['start_date'])
@Index(['end_date'])
@Index(['manager_id'])
export class Project extends BaseEntity {
  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    enumName: 'project_status',
    default: ProjectStatus.PLANNING,
  })
  status: ProjectStatus;

  @Column({
    type: 'enum',
    enum: ProjectPriority,
    enumName: 'project_priority',
    default: ProjectPriority.MEDIUM,
  })
  priority: ProjectPriority;

  @Column({ name: 'start_date', type: 'timestamp with time zone', nullable: true })
  start_date: Date | null;

  @Column({ name: 'end_date', type: 'timestamp with time zone', nullable: true })
  end_date: Date | null;

  @Column({ name: 'due_date', type: 'timestamp with time zone', nullable: true })
  due_date: Date | null;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column({ length: 50, nullable: true })
  color: string | null;

  @Column({ name: 'budget', type: 'decimal', precision: 15, scale: 2, nullable: true })
  budget: number | null;

  @Column({ name: 'organization_id' })
  organization_id: number;

  @ManyToOne(() => Organization, (organization) => organization.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'manager_id', nullable: true })
  manager_id: number | null;

  @ManyToOne(() => User, (user) => user.managed_projects, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'manager_id' })
  manager: User | null;

  @Column({ name: 'task_count', default: 0 })
  task_count: number;

  @Column({ name: 'milestone_count', default: 0 })
  milestone_count: number;

  @Column({ name: 'phase_count', default: 0 })
  phase_count: number;

  @OneToMany(() => Phase, (phase) => phase.project)
  phases: Phase[];

  @OneToMany(() => Milestone, (milestone) => milestone.project)
  milestones: Milestone[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => ProjectStatusHistory, (history) => history.project)
  status_history: ProjectStatusHistory[];

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];
}
