import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationPreference, NotificationType } from '../entities/notification-preference.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class NotificationPreferenceService {
  constructor(
    @InjectRepository(NotificationPreference)
    private notificationPreferenceRepository: Repository<NotificationPreference>,
  ) {}

  async getUserPreferences(userId: number): Promise<NotificationPreference[]> {
    return this.notificationPreferenceRepository.find({
      where: { user_id: userId },
    });
  }

  async getPreference(
    userId: number,
    notificationType: NotificationType,
  ): Promise<NotificationPreference | null> {
    return this.notificationPreferenceRepository.findOne({
      where: {
        user_id: userId,
        notification_type: notificationType,
      },
    });
  }

  async isEmailEnabled(userId: number, notificationType: NotificationType): Promise<boolean> {
    const preference = await this.getPreference(userId, notificationType);
    return preference?.email_enabled ?? true; // Default to true
  }

  async updatePreference(
    userId: number,
    notificationType: NotificationType,
    emailEnabled: boolean,
    inAppEnabled: boolean,
    reminderHours?: number,
  ): Promise<NotificationPreference> {
    let preference = await this.getPreference(userId, notificationType);

    if (!preference) {
      preference = this.notificationPreferenceRepository.create({
        user_id: userId,
        organization_id: 0, // Will be set when saving
        notification_type: notificationType,
        email_enabled: emailEnabled,
        in_app_enabled: inAppEnabled,
        reminder_hours: reminderHours || 24,
      });
    } else {
      preference.email_enabled = emailEnabled;
      preference.in_app_enabled = inAppEnabled;
      if (reminderHours !== undefined) {
        preference.reminder_hours = reminderHours;
      }
    }

    return this.notificationPreferenceRepository.save(preference);
  }

  async setDefaultPreferences(user: User): Promise<void> {
    const defaultPreferences: Partial<NotificationPreference>[] = [
      { notification_type: NotificationType.TASK_ASSIGNED, email_enabled: true, in_app_enabled: true },
      { notification_type: NotificationType.TASK_UPDATED, email_enabled: true, in_app_enabled: true },
      { notification_type: NotificationType.TASK_COMMENT, email_enabled: true, in_app_enabled: true },
      { notification_type: NotificationType.TASK_DUE_SOON, email_enabled: true, in_app_enabled: true, reminder_hours: 24 },
      { notification_type: NotificationType.TASK_OVERDUE, email_enabled: true, in_app_enabled: true },
      { notification_type: NotificationType.TASK_COMPLETED, email_enabled: true, in_app_enabled: true },
      { notification_type: NotificationType.PROJECT_CREATED, email_enabled: true, in_app_enabled: true },
      { notification_type: NotificationType.PROJECT_UPDATED, email_enabled: false, in_app_enabled: true },
      { notification_type: NotificationType.MILESTONE_COMPLETED, email_enabled: true, in_app_enabled: true },
      { notification_type: NotificationType.MILESTONE_DUE_SOON, email_enabled: true, in_app_enabled: true, reminder_hours: 48 },
    ];

    for (const pref of defaultPreferences) {
      await this.notificationPreferenceRepository.save({
        ...pref,
        user_id: user.id,
        organization_id: user.organization_id,
      });
    }
  }

  async getUsersWithNotificationEnabled(
    notificationType: NotificationType,
    organizationId: number,
  ): Promise<User[]> {
    const preferences = await this.notificationPreferenceRepository.find({
      where: {
        notification_type: notificationType,
        email_enabled: true,
      },
      relations: ['user'],
    });

    return preferences
      .filter((p) => p.user.organization_id === organizationId)
      .map((p) => p.user);
  }
}
