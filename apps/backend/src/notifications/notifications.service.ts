import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationPreference, NotificationType as PrefNotificationType } from '../entities/notification-preference.entity';
import { NotificationType, NotificationPriority } from '../entities/common.enums';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(NotificationPreference)
    private preferencesRepository: Repository<NotificationPreference>,
    @Inject(forwardRef(() => NotificationsGateway))
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    userId: number,
    organizationId: number,
    dto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      user_id: userId,
      organization_id: organizationId,
      ...dto,
    });

    const saved = await this.notificationsRepository.save(notification);

    // Send real-time notification via WebSocket
    this.notificationsGateway.sendNotificationToUser(userId, saved);

    // Update unread count for the user
    const unreadCount = await this.getUnreadCount(userId);
    this.notificationsGateway.sendUnreadCount(userId, unreadCount);

    return saved;
  }

  async findAll(
    userId: number,
    organizationId: number,
    options: {
      unreadOnly?: boolean;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{ items: Notification[]; total: number }> {
    const { unreadOnly = false, limit = 50, offset = 0 } = options;

    const queryBuilder = this.notificationsRepository
      .createQueryBuilder('notification')
      .where('notification.user_id = :userId', { userId })
      .andWhere('notification.organization_id = :organizationId', { organizationId })
      .orderBy('notification.created_at', 'DESC');

    if (unreadOnly) {
      queryBuilder.andWhere('notification.read_at IS NULL');
    }

    const [items, total] = await queryBuilder
      .limit(limit)
      .offset(offset)
      .getManyAndCount();

    return { items, total };
  }

  async findOne(id: number, userId: number): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.user_id !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(id: number, userId: number): Promise<Notification> {
    const notification = await this.findOne(id, userId);

    if (!notification.read_at) {
      notification.read_at = new Date();
      await this.notificationsRepository.save(notification);

    }

    return notification;
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationsRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ read_at: new Date() })
      .where('user_id = :userId', { userId })
      .andWhere('read_at IS NULL')
      .execute();

  }

  async delete(id: number, userId: number): Promise<void> {
    const notification = await this.findOne(id, userId);
    await this.notificationsRepository.remove(notification);

  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationsRepository.count({
      where: {
        user_id: userId,
        read_at: null as any,
      },
    });
  }

  async getPreferences(userId: number, organizationId: number): Promise<NotificationPreference[]> {
    const preferences = await this.preferencesRepository.find({
      where: {
        user_id: userId,
        organization_id: organizationId,
      },
    });

    // If no preferences exist, create default ones
    if (preferences.length === 0) {
      return this.createDefaultPreferences(userId, organizationId);
    }

    return preferences;
  }

  async updatePreference(
    userId: number,
    organizationId: number,
    type: string,
    updateData: Partial<Pick<NotificationPreference, 'email_enabled' | 'in_app_enabled' | 'reminder_hours'>>,
  ): Promise<NotificationPreference> {
    const preference = await this.preferencesRepository.findOne({
      where: {
        user_id: userId,
        organization_id: organizationId,
        notification_type: type as any,
      },
    });

    if (!preference) {
      // If preference doesn't exist, create it
      const newPreference = this.preferencesRepository.create({
        user_id: userId,
        organization_id: organizationId,
        notification_type: type as any,
        email_enabled: updateData.email_enabled ?? true,
        in_app_enabled: updateData.in_app_enabled ?? true,
        reminder_hours: updateData.reminder_hours ?? 24,
      });
      return this.preferencesRepository.save(newPreference);
    }

    // Update the preference
    Object.assign(preference, updateData);
    return this.preferencesRepository.save(preference);
  }

  private async createDefaultPreferences(userId: number, organizationId: number): Promise<NotificationPreference[]> {
    const defaultTypes = Object.values(PrefNotificationType);
    const preferences: NotificationPreference[] = [];

    for (const type of defaultTypes) {
      const preference = this.preferencesRepository.create({
        user_id: userId,
        organization_id: organizationId,
        notification_type: type as any,
        email_enabled: true,
        in_app_enabled: true,
        reminder_hours: 24,
      });
      const saved = await this.preferencesRepository.save(preference);
      preferences.push(saved);
    }

    return preferences;
  }

  // Helper methods to create different types of notifications
  async notifyTaskAssigned(
    userId: number,
    organizationId: number,
    taskTitle: string,
    taskId: number,
    assignedBy: string,
  ): Promise<Notification> {
    return this.create(userId, organizationId, {
      type: NotificationType.TASK_ASSIGNED,
      title: 'New Task Assigned',
      message: `You have been assigned to task: ${taskTitle} by ${assignedBy}`,
      priority: NotificationPriority.HIGH,
      related_entity_type: 'task',
      related_entity_id: taskId,
      action_url: `/tasks/${taskId}`,
      data: { task_title: taskTitle, assigned_by: assignedBy },
    });
  }

  async notifyTaskUpdated(
    userId: number,
    organizationId: number,
    taskTitle: string,
    taskId: number,
    updatedBy: string,
  ): Promise<Notification> {
    return this.create(userId, organizationId, {
      type: NotificationType.TASK_UPDATED,
      title: 'Task Updated',
      message: `Task "${taskTitle}" has been updated by ${updatedBy}`,
      priority: NotificationPriority.MEDIUM,
      related_entity_type: 'task',
      related_entity_id: taskId,
      action_url: `/tasks/${taskId}`,
      data: { task_title: taskTitle, updated_by: updatedBy },
    });
  }

  async notifyTaskCompleted(
    userId: number,
    organizationId: number,
    taskTitle: string,
    taskId: number,
    completedBy: string,
  ): Promise<Notification> {
    return this.create(userId, organizationId, {
      type: NotificationType.TASK_COMPLETED,
      title: 'Task Completed',
      message: `Task "${taskTitle}" has been completed by ${completedBy}`,
      priority: NotificationPriority.MEDIUM,
      related_entity_type: 'task',
      related_entity_id: taskId,
      action_url: `/tasks/${taskId}`,
      data: { task_title: taskTitle, completed_by: completedBy },
    });
  }

  async notifyCommentAdded(
    userId: number,
    organizationId: number,
    taskTitle: string,
    taskId: number,
    commentAuthor: string,
  ): Promise<Notification> {
    return this.create(userId, organizationId, {
      type: NotificationType.COMMENT_ADDED,
      title: 'New Comment',
      message: `${commentAuthor} commented on task: ${taskTitle}`,
      priority: NotificationPriority.LOW,
      related_entity_type: 'task',
      related_entity_id: taskId,
      action_url: `/tasks/${taskId}`,
      data: { task_title: taskTitle, comment_author: commentAuthor },
    });
  }

  async notifyMention(
    userId: number,
    organizationId: number,
    mentionedBy: string,
    entityType: string,
    entityTitle: string,
    entityId: number,
  ): Promise<Notification> {
    return this.create(userId, organizationId, {
      type: NotificationType.MENTION,
      title: 'You Were Mentioned',
      message: `${mentionedBy} mentioned you in ${entityType}: ${entityTitle}`,
      priority: NotificationPriority.HIGH,
      related_entity_type: entityType,
      related_entity_id: entityId,
      action_url: `/${entityType}s/${entityId}`,
      data: { mentionedBy, entityType, entityTitle },
    });
  }

  async notifyMilestoneDue(
    userId: number,
    organizationId: number,
    milestoneTitle: string,
    milestoneId: number,
    dueDate: Date,
  ): Promise<Notification> {
    return this.create(userId, organizationId, {
      type: NotificationType.MILESTONE_DUE,
      title: 'Milestone Due Soon',
      message: `Milestone "${milestoneTitle}" is due on ${new Date(dueDate).toLocaleDateString()}`,
      priority: NotificationPriority.HIGH,
      related_entity_type: 'milestone',
      related_entity_id: milestoneId,
      action_url: `/milestones/${milestoneId}`,
      data: { milestone_title: milestoneTitle, due_date: dueDate },
    });
  }

  async notifyProjectUpdated(
    userId: number,
    organizationId: number,
    projectTitle: string,
    projectId: number,
    updatedBy: string,
  ): Promise<Notification> {
    return this.create(userId, organizationId, {
      type: NotificationType.PROJECT_UPDATED,
      title: 'Project Updated',
      message: `Project "${projectTitle}" has been updated by ${updatedBy}`,
      priority: NotificationPriority.MEDIUM,
      related_entity_type: 'project',
      related_entity_id: projectId,
      action_url: `/projects/${projectId}`,
      data: { project_title: projectTitle, updated_by: updatedBy },
    });
  }
}
