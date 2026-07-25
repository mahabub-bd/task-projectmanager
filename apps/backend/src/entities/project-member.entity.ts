import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Department } from './department.entity';
import { Project } from './project.entity';
import { User } from './user.entity';

export enum ProjectMemberRole {
  LEAD = 'lead',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

@Entity('project_members')
@Index(['project_id'])
@Index(['user_id'])
@Index(['department_id'])
export class ProjectMember extends BaseEntity {
  @Column({ name: 'project_id' })
  project_id: number;

  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'user_id', nullable: true })
  user_id: number | null;

  @ManyToOne(() => User, (user) => user.project_memberships, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ name: 'department_id', nullable: true })
  department_id: number | null;

  @ManyToOne(() => Department, (department) => department.project_memberships, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'department_id' })
  department: Department | null;

  @Column({
    type: 'enum',
    enum: ProjectMemberRole,
    enumName: 'project_member_role',
    default: ProjectMemberRole.MEMBER,
  })
  role: ProjectMemberRole;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'joined_at', type: 'timestamp with time zone' })
  joined_at: Date;
}
