import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PhaseStatus } from '../common/enum';
import { BaseEntity } from './base.entity';
import { Milestone } from './milestone.entity';
import { Organization } from './organization.entity';
import { Project } from './project.entity';

@Entity('phases')
@Index(['organization_id'])
@Index(['project_id'])
@Index(['status'])
@Index(['start_date'])
@Index(['end_date'])
export class Phase extends BaseEntity {
  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: PhaseStatus,
    enumName: 'phase_status',
    default: PhaseStatus.NOT_STARTED,
  })
  status: PhaseStatus;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column({ length: 50, nullable: true })
  color: string | null;

  @Column({ name: 'organization_id' })
  organization_id: number;

  @ManyToOne(() => Organization, (organization) => organization.phases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'project_id' })
  project_id: number;

  @ManyToOne(() => Project, (project) => project.phases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ name: 'start_date', type: 'timestamp with time zone', nullable: true })
  start_date: Date | null;

  @Column({ name: 'end_date', type: 'timestamp with time zone', nullable: true })
  end_date: Date | null;

  @Column({ name: 'due_date', type: 'timestamp with time zone', nullable: true })
  due_date: Date | null;

  @OneToMany(() => Milestone, (milestone) => milestone.phase)
  milestones: Milestone[];
}
