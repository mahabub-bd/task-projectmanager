import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Project, ProjectStatus } from './project.entity';
import { User } from './user.entity';

@Entity('project_status_history')
@Index(['project_id'])
@Index(['changed_by'])
export class ProjectStatusHistory extends BaseEntity {
  @Column({ name: 'project_id' })
  project_id: number;

  @ManyToOne(() => Project, (project) => project.status_history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    enumName: 'project_status',
    nullable: true,
  })
  from_status: ProjectStatus | null;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    enumName: 'project_status',
  })
  to_status: ProjectStatus;

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
