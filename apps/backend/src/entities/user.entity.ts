import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { BaseEntity } from './base.entity';
import { CommentLike } from './comment-like.entity';
import { Department } from './department.entity';
import { Designation } from './designation.entity';
import { Notification } from './notification.entity';
import { Organization } from './organization.entity';
import { ProjectMember } from './project-member.entity';
import { Project } from './project.entity';
import { TaskAttachment } from './task-attachment.entity';
import { TaskComment } from './task-comment.entity';
import { Task } from './task.entity';
import { UserRole } from './user-role.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

@Entity('users')
@Index(['email'])
@Index(['organization_id'])
@Index(['department_id'])
export class User extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ name: 'employee_id', length: 50, nullable: true, unique: true })
  employee_id: string | null;

  @Column({ name: 'password_hash' })
  password_hash: string;

  @Column({ name: 'phone_number', length: 20, nullable: true })
  phone_number: string | null;

  @Column({
    type: 'enum',
    enum: UserStatus,
    enumName: 'user_status',
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({ name: 'avatar_url', length: 500, nullable: true })
  avatar_url: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ name: 'organization_id' })
  organization_id: number;

  @ManyToOne(() => Organization, (organization) => organization.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'department_id', nullable: true })
  department_id: number | null;

  @ManyToOne(() => Department, (department) => department.users, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'department_id' })
  department: Department | null;

  @Column({ name: 'designation_id', nullable: true })
  @Index()
  designation_id: number | null;

  @ManyToOne(() => Designation, (designation) => designation.users, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'designation_id' })
  designation: Designation | null;

  @Column({ name: 'is_verified', default: false })
  is_verified: boolean;

  @Column({ name: 'last_login_at', type: 'timestamp with time zone', nullable: true })
  last_login_at: Date | null;

  @Column({ name: 'is_online', default: false })
  is_online: boolean;

  @Column({ name: 'last_seen_at', type: 'timestamp with time zone', nullable: true })
  last_seen_at: Date | null;

  @Column({ name: 'email_verified_at', type: 'timestamp with time zone', nullable: true })
  email_verified_at: Date | null;

  @Column({ name: 'reset_token', length: 500, nullable: true })
  reset_token: string | null;

  @Column({ name: 'reset_token_expires_at', type: 'timestamp with time zone', nullable: true })
  reset_token_expires_at: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  preferences: Record<string, any>;

  @OneToMany(() => Task, (task) => task.created_by_user)
  created_tasks: Task[];

  @OneToMany(() => Task, (task) => task.assigned_to_user)
  assigned_tasks: Task[];

  @OneToMany(() => Project, (project) => project.manager)
  managed_projects: Project[];

  @OneToMany(() => TaskComment, (comment) => comment.user)
  comments: TaskComment[];

  @OneToMany(() => CommentLike, (like) => like.user)
  comment_likes: CommentLike[];

  @OneToMany(() => TaskAttachment, (attachment) => attachment.uploaded_by_user)
  attachments: TaskAttachment[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  audit_logs: AuditLog[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  user_roles: UserRole[];

  @OneToMany(() => ProjectMember, (projectMember) => projectMember.user)
  project_memberships: ProjectMember[];
}
