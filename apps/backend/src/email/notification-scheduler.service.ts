import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from '../entities/milestone.entity';
import { Task } from '../entities/task.entity';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);

  constructor(
    private notificationService: NotificationService,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
  ) {}

  // Run every day at midnight to check for tasks due soon
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleTaskDueSoonReminders() {
    this.logger.log('Checking for tasks due soon...');

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find tasks due in the next 24 hours that are not completed
    const tasksDueSoon = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assigned_to_user', 'assignedUser')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.due_date BETWEEN :now AND :tomorrow', { now, tomorrow })
      .andWhere('task.status NOT IN (:...completedStatuses)', {
        completedStatuses: ['completed', 'closed'],
      })
      .getMany();

    for (const task of tasksDueSoon) {
      if (task.assigned_to_user?.email) {
        try {
          await this.notificationService.sendTaskDueSoonReminder(
            task.assigned_to_user.email,
            task.assigned_to_user.name || task.assigned_to_user.email,
            task.title,
            task.due_date,
            `${process.env.FRONTEND_URL}/tasks/${task.id}`,
          );
          this.logger.log(`Sent due soon reminder for task: ${task.id}`);
        } catch (error) {
          this.logger.error(`Failed to send reminder for task ${task.id}:`, error);
        }
      }
    }

    this.logger.log(`Sent ${tasksDueSoon.length} task due soon reminders`);
  }

  // Run every day at midnight to check for overdue tasks
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleTaskOverdueNotifications() {
    this.logger.log('Checking for overdue tasks...');

    const now = new Date();

    // Find overdue tasks that are not completed
    const overdueTasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assigned_to_user', 'assignedUser')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.due_date < :now', { now })
      .andWhere('task.status NOT IN (:...completedStatuses)', {
        completedStatuses: ['completed', 'closed'],
      })
      .getMany();

    for (const task of overdueTasks) {
      if (task.assigned_to_user?.email) {
        try {
          await this.notificationService.sendTaskOverdueNotification(
            task.assigned_to_user.email,
            task.assigned_to_user.name || task.assigned_to_user.email,
            task.title,
            task.due_date,
            `${process.env.FRONTEND_URL}/tasks/${task.id}`,
          );
          this.logger.log(`Sent overdue notification for task: ${task.id}`);
        } catch (error) {
          this.logger.error(`Failed to send overdue notification for task ${task.id}:`, error);
        }
      }
    }

    this.logger.log(`Sent ${overdueTasks.length} task overdue notifications`);
  }

  // Run every 6 hours to check for milestones due soon
  @Cron('0 */6 * * *')
  async handleMilestoneDueSoonReminders() {
    this.logger.log('Checking for milestones due soon...');

    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Find milestones due in the next 3 days that are not completed
    const milestonesDueSoon = await this.milestoneRepository
      .createQueryBuilder('milestone')
      .leftJoinAndSelect('milestone.project', 'project')
      .leftJoinAndSelect('project.organization', 'organization')
      .where('milestone.due_date BETWEEN :now AND :threeDaysLater', { now, threeDaysLater })
      .andWhere('milestone.status NOT IN (:...completedStatuses)', {
        completedStatuses: ['completed', 'cancelled'],
      })
      .getMany();

    for (const milestone of milestonesDueSoon) {
      // Get project members to notify
      const projectMembers = await this.getProjectMembersEmails(milestone.project_id);

      for (const memberEmail of projectMembers) {
        try {
          await this.notificationService.sendMilestoneDueSoonReminder(
            memberEmail.email,
            memberEmail.name || memberEmail.email,
            milestone.name,
            milestone.project.name,
            milestone.due_date,
            `${process.env.FRONTEND_URL}/projects/${milestone.project_id}`,
          );
          this.logger.log(`Sent due soon reminder for milestone: ${milestone.id}`);
        } catch (error) {
          this.logger.error(`Failed to send reminder for milestone ${milestone.id}:`, error);
        }
      }
    }

    this.logger.log(`Sent milestone due soon reminders`);
  }

  // Helper method to get project members' emails
  private async getProjectMembersEmails(projectId: number): Promise<any[]> {
    // This would query your project members table
    // For now, return empty array - implement based on your project structure
    return [];
  }
}
