import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { MilestoneStatus } from '../common/enum';
import { BaseEntity } from './base.entity';
import { MilestoneStatusHistory } from './milestone-status-history.entity';
import { Organization } from './organization.entity';
import { Phase } from './phase.entity';
import { Project } from './project.entity';

@Entity('milestones')
@Index(['organization_id'])
@Index(['project_id'])
@Index(['phase_id'])
@Index(['status'])
@Index(['start_date'])
@Index(['end_date'])
export class Milestone extends BaseEntity {
  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: MilestoneStatus,
    enumName: 'milestone_status',
    default: MilestoneStatus.NOT_STARTED,
  })
  status: MilestoneStatus;

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

  @Column({ name: 'organization_id' })
  organization_id: number;

  @ManyToOne(() => Organization, (organization) => organization.milestones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'project_id', nullable: true })
  project_id: number | null;

  @ManyToOne(() => Project, (project) => project.milestones, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project | null;

  @Column({ name: 'phase_id', nullable: true })
  phase_id: number | null;

  @ManyToOne(() => Phase, (phase) => phase.milestones, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'phase_id' })
  phase: Phase | null;

  @Column({ type: 'int', default: 0 })
  order: number;

  @OneToMany(() => MilestoneStatusHistory, (history) => history.milestone)
  status_history: MilestoneStatusHistory[];
}


