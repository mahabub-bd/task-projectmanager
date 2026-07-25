import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Milestone } from './milestone.entity';
import { MilestoneStatus } from '../common/enum';
import { User } from './user.entity';

@Entity('milestone_status_history')
@Index(['milestone_id'])
@Index(['changed_by'])
export class MilestoneStatusHistory extends BaseEntity {
  @Column({ name: 'milestone_id' })
  milestone_id: number;

  @ManyToOne(() => Milestone, (milestone) => milestone.status_history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;

  @Column({
    type: 'enum',
    enum: MilestoneStatus,
    enumName: 'milestone_status',
    default: MilestoneStatus.NOT_STARTED,
  })
  from_status: MilestoneStatus;

  @Column({
    type: 'enum',
    enum: MilestoneStatus,
    enumName: 'milestone_status',
    default: MilestoneStatus.IN_PROGRESS,
  })
  to_status: MilestoneStatus;

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
