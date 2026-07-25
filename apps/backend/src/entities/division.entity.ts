import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Department } from './department.entity';
import { Organization } from './organization.entity';

@Entity('divisions')
export class Division extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'organization_id' })
  organization_id: number;

  @ManyToOne(() => Organization, (organization) => organization.divisions)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'parent_division_id', nullable: true })
  parent_division_id: number | null;

  @ManyToOne(() => Division, (division) => division.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_division_id' })
  parent: Division | null;

  @OneToMany(() => Division, (division) => division.parent)
  children: Division[];

  @OneToMany(() => Department, (department) => department.division)
  departments: Department[];
}
