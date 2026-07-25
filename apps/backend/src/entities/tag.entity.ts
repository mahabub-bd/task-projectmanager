import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { Task } from './task.entity';

@Entity('tags')
export class Tag extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, default: 'default' })
  color: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'organization_id' })
  organization_id: number;

  @ManyToOne(() => Organization, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToMany(() => Task, (task) => task.tags, {
    cascade: true,
  })
  tasks: Task[];
}
