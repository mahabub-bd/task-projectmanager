import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from '../entities/project.entity';
import { ProjectMember } from '../entities/project-member.entity';
import { ProjectStatusHistory } from '../entities/project-status-history.entity';
import { Milestone } from '../entities/milestone.entity';
import { Task } from '../entities/task.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AppNotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectMember, ProjectStatusHistory, Milestone, Task]),
    AuditLogsModule,
    AppNotificationsModule,
    EmailModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
