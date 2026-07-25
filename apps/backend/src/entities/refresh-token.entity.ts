import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('refresh_tokens')
@Index(['user_id'])
@Index(['token'])
@Index(['expires_at'])
export class RefreshToken extends BaseEntity {
  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  token: string;

  @Column({ name: 'expires_at', type: 'timestamp with time zone' })
  expires_at: Date;

  @Column({ name: 'revoked_at', type: 'timestamp with time zone', nullable: true })
  revoked_at: Date | null;

  @Column({ name: 'is_revoked', default: false })
  is_revoked: boolean;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ip_address: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  user_agent: string | null;
}
