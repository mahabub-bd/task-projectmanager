import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Department } from './department.entity';
import { Designation } from './designation.entity';
import { Division } from './division.entity';
import { Milestone } from './milestone.entity';
import { Phase } from './phase.entity';
import { Project } from './project.entity';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity('organizations')
export class Organization extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50, unique: true })
  slug: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ name: 'logo_url', length: 500, nullable: true })
  logo_url: string;

  @Column({ name: 'dark_logo_url', length: 500, nullable: true })
  dark_logo_url: string;

  @Column({ name: 'light_logo_url', length: 500, nullable: true })
  light_logo_url: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Division, (division) => division.organization)
  divisions: Division[];

  @OneToMany(() => Department, (department) => department.organization)
  departments: Department[];

  @OneToMany(() => Designation, (designation) => designation.organization)
  designations: Designation[];

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => Role, (role) => role.organization)
  roles: Role[];

  @OneToMany(() => Project, (project) => project.organization)
  projects: Project[];

  @OneToMany(() => Milestone, (milestone) => milestone.organization)
  milestones: Milestone[];

  @OneToMany(() => Phase, (phase) => phase.organization)
  phases: Phase[];
}
