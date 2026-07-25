import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Designation } from './designation.entity';
import { Division } from './division.entity';
import { Organization } from './organization.entity';
import { ProjectMember } from './project-member.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity('departments')
export class Department extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'organization_id' })
  organization_id: number;

  @ManyToOne(() => Organization, (organization) => organization.departments)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'division_id', nullable: true })
  @Index()
  division_id: number | null;

  @ManyToOne(() => Division, (division) => division.departments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'division_id' })
  division: Division | null;

  @OneToMany(() => User, (user) => user.department)
  users: User[];

  @OneToMany(() => Designation, (designation) => designation.department)
  designations: Designation[];

  @OneToMany(() => Task, (task) => task.department)
  tasks: Task[];

  @OneToMany(() => ProjectMember, (projectMember) => projectMember.department)
  project_memberships: ProjectMember[];
}
