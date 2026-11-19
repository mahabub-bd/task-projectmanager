import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../entities/department.entity';
import { Milestone } from '../entities/milestone.entity';
import { Organization } from '../entities/organization.entity';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, Milestone, User, Department, Organization])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
