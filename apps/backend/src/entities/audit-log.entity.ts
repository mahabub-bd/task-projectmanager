import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  ASSIGN = 'assign',
  REASSIGN = 'reassign',
  STATUS_CHANGE = 'status_change',
  PERMISSION_CHANGE = 'permission_change',
  PASSWORD_CHANGE = 'password_change',
  PASSWORD_RESET = 'password_reset',
  FILE_UPLOAD = 'file_upload',
  FILE_DOWNLOAD = 'file_download',
  EXPORT = 'export',
  IMPORT = 'import',
}

@Entity('audit_logs')
@Index(['user_id'])
@Index(['entity_type', 'entity_id'])
@Index(['action'])
@Index(['created_at'])
export class AuditLog extends BaseEntity {
  @Column({ name: 'user_id', nullable: true })
  user_id: number | null;

  @ManyToOne(() => User, (user) => user.audit_logs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({
    type: 'enum',
    enum: AuditAction,
    enumName: 'audit_action',
  })
  action: AuditAction;

  @Column({ name: 'entity_type', length: 100 })
  entity_type: string;

  @Column({ name: 'entity_id' })
  entity_id: number;

  @Column({ type: 'jsonb', nullable: true })
  old_values: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  new_values: Record<string, any> | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ip_address: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  user_agent: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ name: 'organization_id', nullable: true })
  organization_id: number | null;
}
