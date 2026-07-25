import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('user_roles')
@Unique(['user_id', 'role_id'])
@Index(['user_id'])
@Index(['role_id'])
export class UserRole extends BaseEntity {
  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.user_roles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'role_id' })
  role_id: number;

  @ManyToOne(() => Role, (role) => role.user_roles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'assigned_by', nullable: true })
  assigned_by: string | null;

  @Column({ name: 'assigned_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  assigned_at: Date;
}
