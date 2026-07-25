import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { WorkflowTransition } from './workflow-transition.entity';
import { Workflow } from './workflow.entity';

@Entity('workflow_states')
export class WorkflowState extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'workflow_id' })
  workflow_id: number;

  @ManyToOne(() => Workflow, (workflow) => workflow.states, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workflow_id' })
  workflow: Workflow;

  @Column({ default: 0 })
  order: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => WorkflowTransition, (transition) => transition.from_state)
  transitions_from: WorkflowTransition[];

  @OneToMany(() => WorkflowTransition, (transition) => transition.to_state)
  transitions_to: WorkflowTransition[];
}
