import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { Milestone } from '../entities/milestone.entity';
import { Organization } from '../entities/organization.entity';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  /**
   * Aggregate counts for the dashboard in a handful of GROUP BY queries
   * instead of shipping every row to the client.
   */
  async getStats() {
    const now = new Date();

    const [tasksByStatus, projectsByStatus, milestonesByStatus, taskPriorities, overdueTasks, totalUsers, totalDepartments, totalOrganizations] =
      await Promise.all([
        this.taskRepository
          .createQueryBuilder('task')
          .select('task.status', 'status')
          .addSelect('COUNT(*)', 'count')
          .groupBy('task.status')
          .getRawMany<{ status: string; count: string }>(),

        this.projectRepository
          .createQueryBuilder('project')
          .select('project.status', 'status')
          .addSelect('COUNT(*)', 'count')
          .groupBy('project.status')
          .getRawMany<{ status: string; count: string }>(),

        this.milestoneRepository
          .createQueryBuilder('milestone')
          .select('milestone.status', 'status')
          .addSelect('COUNT(*)', 'count')
          .groupBy('milestone.status')
          .getRawMany<{ status: string; count: string }>(),

        this.taskRepository
          .createQueryBuilder('task')
          .select('task.priority', 'priority')
          .addSelect('COUNT(*)', 'count')
          .where('task.status NOT IN (:...done)', { done: ['completed', 'cancelled'] })
          .groupBy('task.priority')
          .getRawMany<{ priority: string; count: string }>(),

        this.taskRepository
          .createQueryBuilder('task')
          .where('task.status NOT IN (:...done)', { done: ['completed', 'cancelled'] })
          .andWhere(
            new Brackets((qb) => {
              qb.where('task.due_date IS NOT NULL').andWhere('task.due_date < :now', { now });
            }),
          )
          .getCount(),

        this.userRepository.count(),
        this.departmentRepository.count(),
        this.organizationRepository.count(),
      ]);

    const toCounts = (rows: { status: string; count: string }[]) =>
      rows.reduce<Record<string, number>>((acc, row) => {
        acc[row.status] = Number(row.count);
        return acc;
      }, {});

    const taskCounts = toCounts(tasksByStatus);
    const projectCounts = toCounts(projectsByStatus);
    const milestoneCounts = toCounts(milestonesByStatus);
    const priorityCounts = taskPriorities.reduce<Record<string, number>>((acc, row) => {
      acc[row.priority] = Number(row.count);
      return acc;
    }, {});

    const totalTasks = Object.values(taskCounts).reduce((a, b) => a + b, 0);
    const completedTasks = taskCounts['completed'] ?? 0;

    return {
      tasks: {
        total: totalTasks,
        byStatus: taskCounts,
        byPriority: priorityCounts,
        completed: completedTasks,
        overdue: overdueTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      projects: {
        total: Object.values(projectCounts).reduce((a, b) => a + b, 0),
        byStatus: projectCounts,
      },
      milestones: {
        total: Object.values(milestoneCounts).reduce((a, b) => a + b, 0),
        byStatus: milestoneCounts,
        completed: milestoneCounts['completed'] ?? 0,
      },
      organization: {
        totalOrganizations,
        totalDepartments,
        totalUsers,
      },
      generatedAt: now.toISOString(),
    };
  }
}
