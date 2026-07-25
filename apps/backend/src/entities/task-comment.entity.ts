import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Task } from './task.entity';
import { User } from './user.entity';
import { CommentLike } from './comment-like.entity';

@Entity('task_comments')
@Index(['task_id'])
@Index(['user_id'])
export class TaskComment extends BaseEntity {
  @Column({ name: 'task_id' })
  task_id: number;

  @ManyToOne(() => Task, (task) => task.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  comment: string;

  @Column({ name: 'parent_comment_id', nullable: true })
  parent_comment_id: number | null;

  @ManyToOne(() => TaskComment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_comment_id' })
  parent_comment: TaskComment | null;

  @Column({ name: 'is_edited', default: false })
  is_edited: boolean;

  @Column({ name: 'edited_at', type: 'timestamp with time zone', nullable: true })
  edited_at: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  mentions: string[];

  @OneToMany(() => TaskComment, (comment) => comment.parent_comment)
  replies: TaskComment[];

  @OneToMany(() => CommentLike, (like) => like.comment)
  likes: CommentLike[];
}
