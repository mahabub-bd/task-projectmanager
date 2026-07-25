import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskComment } from '../entities/task-comment.entity';
import { CommentLike } from '../entities/comment-like.entity';
import { Task } from '../entities/task.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(TaskComment)
    private commentRepository: Repository<TaskComment>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(CommentLike)
    private commentLikeRepository: Repository<CommentLike>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number): Promise<TaskComment> {
    const task = await this.taskRepository.findOne({
      where: { id: createCommentDto.task_id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const comment = this.commentRepository.create({
      task_id: createCommentDto.task_id,
      user_id: userId,
      comment: createCommentDto.content,
      parent_comment_id: createCommentDto.parent_comment_id,
      mentions: createCommentDto.mentions?.map((id) => String(id)) || [],
    });

    const savedComment = await this.commentRepository.save(comment);

    // Update task comment count
    await this.taskRepository.increment({ id: createCommentDto.task_id }, 'comment_count', 1);

    // Send notification to task assignee if they are not the commenter
    if (task.assigned_to && task.assigned_to !== userId) {
      const organizationId = task.project?.organization_id || task.department?.organization_id || 1;
      await this.notificationsService.notifyCommentAdded(
        task.assigned_to,
        organizationId,
        task.title,
        task.id,
        'System', // Should be actual user name
      );
    }

    // Send notifications to mentioned users
    if (createCommentDto.mentions && createCommentDto.mentions.length > 0) {
      const organizationId = task.project?.organization_id || task.department?.organization_id || 1;
      for (const mentionedUserId of createCommentDto.mentions) {
        if (mentionedUserId !== userId) {
          await this.notificationsService.notifyMention(
            mentionedUserId,
            organizationId,
            'System',
            'task',
            task.title,
            task.id,
          );
        }
      }
    }

    return this.findOne(savedComment.id);
  }

  async findByTask(taskId: number): Promise<TaskComment[]> {
    return this.commentRepository.find({
      where: { task_id: taskId },
      relations: ['user', 'parent_comment', 'replies', 'likes'],
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: number): Promise<TaskComment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'task', 'parent_comment', 'replies', 'likes'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number): Promise<TaskComment> {
    const comment = await this.findOne(id);

    if (comment.user_id !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    await this.commentRepository.update(id, {
      comment: updateCommentDto.content,
      is_edited: true,
      edited_at: new Date(),
    });

    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.delete(id);

    // Update task comment count
    await this.taskRepository.decrement({ id: comment.task_id }, 'comment_count', 1);
  }

  async likeComment(commentId: number, userId: number): Promise<TaskComment> {
    // Verify comment exists
    await this.findOne(commentId);

    // Check if user already liked this comment
    const existingLike = await this.commentLikeRepository.findOne({
      where: {
        comment_id: commentId,
        user_id: userId,
      },
    });

    if (existingLike) {
      throw new ForbiddenException('You have already liked this comment');
    }

    // Create like
    await this.commentLikeRepository.save({
      comment_id: commentId,
      user_id: userId,
    });

    return this.findOne(commentId);
  }

  async unlikeComment(commentId: number, userId: number): Promise<TaskComment> {
    // Verify comment exists
    await this.findOne(commentId);

    // Find and delete the like
    const like = await this.commentLikeRepository.findOne({
      where: {
        comment_id: commentId,
        user_id: userId,
      },
    });

    if (!like) {
      throw new ForbiddenException('You have not liked this comment');
    }

    await this.commentLikeRepository.delete(like.id);

    return this.findOne(commentId);
  }

  async getCommentLikes(commentId: number): Promise<CommentLike[]> {
    // Verify comment exists
    await this.findOne(commentId);

    return this.commentLikeRepository.find({
      where: { comment_id: commentId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async checkUserLike(commentId: number, userId: number): Promise<boolean> {
    const like = await this.commentLikeRepository.findOne({
      where: {
        comment_id: commentId,
        user_id: userId,
      },
    });

    return !!like;
  }
}
