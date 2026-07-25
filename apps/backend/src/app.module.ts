import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { DivisionsModule } from './divisions/divisions.module';
import { DepartmentsModule } from './departments/departments.module';
import { DesignationsModule } from './designations/designations.module';
import { ProjectsModule } from './projects/projects.module';
import { MilestonesModule } from './milestones/milestones.module';
import { TagsModule } from './tags/tags.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { NotificationsModule } from './email/notifications.module';
import { AppNotificationsModule } from './notifications/notifications.module';
import { CommonModule } from './common/controllers/common.module';
import { RolesGuard } from './common/guards/roles.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

// Entities must be loaded in order to avoid circular dependency issues
import { Organization } from './entities/organization.entity';
import { Division } from './entities/division.entity';
import { Department } from './entities/department.entity';
import { Designation } from './entities/designation.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { Tag } from './entities/tag.entity';
import { Workflow } from './entities/workflow.entity';
import { WorkflowState } from './entities/workflow-state.entity';
import { WorkflowTransition } from './entities/workflow-transition.entity';
import { Project } from './entities/project.entity';
import { Milestone } from './entities/milestone.entity';
import { Task } from './entities/task.entity';
import { TaskAssignment } from './entities/task-assignment.entity';
import { TaskComment } from './entities/task-comment.entity';
import { CommentLike } from './entities/comment-like.entity';
import { TaskAttachment } from './entities/task-attachment.entity';
import { TaskStatusHistory } from './entities/task-status-history.entity';
import { TaskTag } from './entities/task-tag.entity';
import { Notification } from './entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { AuditLog } from './entities/audit-log.entity';
import { UserRole } from './entities/user-role.entity';
import { ProjectStatusHistory } from './entities/project-status-history.entity';
import { ProjectMember } from './entities/project-member.entity';
import { MilestoneStatusHistory } from './entities/milestone-status-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'taskmanager'),
        entities: [
          Organization,
          Division,
          Department,
          Designation,
          Role,
          Permission,
          User,
          RefreshToken,
          UserRole,
          Tag,
          Workflow,
          WorkflowState,
          WorkflowTransition,
          Project,
          ProjectStatusHistory,
          ProjectMember,
          Milestone,
          MilestoneStatusHistory,
          Task,
          TaskAssignment,
          TaskComment,
          CommentLike,
          TaskAttachment,
          TaskStatusHistory,
          TaskTag,
          Notification,
          NotificationPreference,
          AuditLog,
        ],
        synchronize: true, // enable synchronization for local development
        logging: configService.get<boolean>('DB_LOGGING', false),
        ssl: configService.get<boolean>('DB_SSL', false) === true
          ? { rejectUnauthorized: false }
          : false,
        extra: {
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        },
      }),
    }),
    AuthModule,
    RolesModule,
    OrganizationsModule,
    DivisionsModule,
    DepartmentsModule,
    DesignationsModule,
    ProjectsModule,
    MilestonesModule,
    TagsModule,
    TasksModule,
    CommentsModule,
    AttachmentsModule,
    AuditLogsModule,
    UsersModule,
    EmailModule,
    NotificationsModule,
    AppNotificationsModule,
    CommonModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
