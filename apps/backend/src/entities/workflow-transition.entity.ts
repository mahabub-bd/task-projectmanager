import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Workflow } from './workflow.entity';
import { WorkflowState } from './workflow-state.entity';
import { Role } from './role.entity';

@Entity('workflow_transitions')
export class WorkflowTransition extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'workflow_id' })
  workflow_id: number;

  @ManyToOne(() => Workflow, (workflow) => workflow.transitions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workflow_id' })
  workflow: Workflow;

  @Column({ name: 'from_state_id' })
  from_state_id: number;

  @ManyToOne(() => WorkflowState, (state) => state.transitions_from, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'from_state_id' })
  from_state: WorkflowState;

  @Column({ name: 'to_state_id' })
  to_state_id: number;

  @ManyToOne(() => WorkflowState, (state) => state.transitions_to, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'to_state_id' })
  to_state: WorkflowState;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  conditions: Record<string, any>;

  @ManyToMany(() => Role, { cascade: true })
  @JoinTable({
    name: 'workflow_transition_roles',
    joinColumn: { name: 'transition_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  allowed_roles: Role[];
}
