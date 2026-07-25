import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tag } from './tag.entity';
import { Task } from './task.entity';

@Entity('task_tags')
@Unique(['task_id', 'tag_id'])
@Index(['task_id'])
@Index(['tag_id'])
export class TaskTag extends BaseEntity {
  @Column({ name: 'task_id' })
  task_id: number;

  @ManyToOne(() => Task, (task) => task.tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'tag_id' })
  tag_id: number;

  @ManyToOne(() => Tag, (tag) => tag.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
