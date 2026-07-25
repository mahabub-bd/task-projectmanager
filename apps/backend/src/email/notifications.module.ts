import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from '../entities/milestone.entity';
import { NotificationPreference } from '../entities/notification-preference.entity';
import { Task } from '../entities/task.entity';
import { EmailModule } from './email.module';
import { NotificationPreferenceService } from './notification-preference.service';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationPreference, Task, Milestone]),
    ScheduleModule.forRoot(),
    EmailModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationPreferenceService,
    NotificationSchedulerService,
  ],
  exports: [NotificationPreferenceService],
})
export class NotificationsModule {}
