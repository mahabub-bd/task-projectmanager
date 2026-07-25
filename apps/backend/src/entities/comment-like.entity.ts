import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { TaskComment } from './task-comment.entity';
import { User } from './user.entity';

@Entity('comment_likes')
@Index(['comment_id'])
@Index(['user_id'])
@Unique(['comment_id', 'user_id'])
export class CommentLike extends BaseEntity {
  @Column({ name: 'comment_id' })
  comment_id: number;

  @ManyToOne(() => TaskComment, (comment) => comment.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: TaskComment;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.comment_likes)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
