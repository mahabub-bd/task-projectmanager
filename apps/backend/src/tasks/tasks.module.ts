import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AppNotificationsModule } from '../notifications/notifications.module';
import { Project } from '../entities/project.entity';
import { Tag } from '../entities/tag.entity';
import { TaskAssignment } from '../entities/task-assignment.entity';
import { TaskStatusHistory } from '../entities/task-status-history.entity';
import { TaskTag } from '../entities/task-tag.entity';
import { Task } from '../entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      TaskAssignment,
      TaskStatusHistory,
      TaskTag,
      Tag,
      Project,
    ]),
    AuditLogsModule,
    AppNotificationsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
