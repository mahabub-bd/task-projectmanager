import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../entities/audit-log.entity';
import { Project } from '../entities/project.entity';
import { Tag } from '../entities/tag.entity';
import { TaskAssignment } from '../entities/task-assignment.entity';
import { TaskStatusHistory } from '../entities/task-status-history.entity';
import { TaskTag } from '../entities/task-tag.entity';
import { Task } from '../entities/task.entity';
import { TaskPriority, TaskStatus } from '../entities/tasks.enums';
import { AssignTaskDto } from './dto/assign-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskAssignment)
    private taskAssignmentRepository: Repository<TaskAssignment>,
    @InjectRepository(TaskStatusHistory)
    private taskStatusHistoryRepository: Repository<TaskStatusHistory>,
    @InjectRepository(TaskTag)
    private taskTagRepository: Repository<TaskTag>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private auditLogsService: AuditLogsService,
  ) {}

  // Helper method to update project progress
  private async updateProjectProgress(projectId: number): Promise<void> {
    if (!projectId) return;

    const tasks = await this.taskRepository.find({
      where: { project_id: projectId },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === TaskStatus.COMPLETED).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await this.projectRepository.update(projectId, {
      progress,
      task_count: totalTasks,
    });

    // Auto-complete project if all tasks are done
    if (progress === 100 && totalTasks > 0) {
      await this.projectRepository.update(projectId, {
        status: 'completed' as any,
      });
    }
  }

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      created_by: userId,
      due_date: createTaskDto.due_date ? new Date(createTaskDto.due_date) : null,
      start_date: createTaskDto.start_date ? new Date(createTaskDto.start_date) : null,
    });

    const savedTask = await this.taskRepository.save(task);

    // Handle tags
    if (createTaskDto.tag_ids && createTaskDto.tag_ids.length > 0) {
      const tags = await this.tagRepository.findByIds(createTaskDto.tag_ids);
      for (const tag of tags) {
        const taskTag = this.taskTagRepository.create({
          task_id: savedTask.id,
          tag_id: tag.id,
        });
        await this.taskTagRepository.save(taskTag);
      }
    }

    // Create initial status history
    await this.taskStatusHistoryRepository.save({
      task_id: savedTask.id,
      from_status: TaskStatus.DRAFT,
      to_status: savedTask.status,
      changed_by: userId,
      changed_at: new Date(),
    });

    // Update project progress
    if (savedTask.project_id) {
      await this.updateProjectProgress(Number(savedTask.project_id));
    }

    return this.findOne(Number(savedTask.id));
  }

  async findAll(query: QueryTasksDto, userId?: number): Promise<{ data: Task[]; total: number }> {
    const {
      project_id,
      department_id,
      assigned_to,
      status,
      priority,
      due_date_from,
      due_date_to,
      search,
      page = 1,
      limit = 20,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = query;

    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.department', 'department')
      .leftJoinAndSelect('task.created_by_user', 'created_by_user')
      .leftJoinAndSelect('task.assigned_to_user', 'assigned_to_user')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.tags', 'task_tags')
      .leftJoinAndSelect('task_tags.tag', 'tags')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'assignment_users');

    if (project_id) {
      queryBuilder.andWhere('task.project_id = :project_id', { project_id });
    }

    if (department_id) {
      queryBuilder.andWhere('task.department_id = :department_id', { department_id });
    }

    if (assigned_to) {
      queryBuilder.andWhere('task.assigned_to = :assigned_to', { assigned_to });
    }

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('task.priority = :priority', { priority });
    }

    if (due_date_from) {
      queryBuilder.andWhere('task.due_date >= :due_date_from', {
        due_date_from: new Date(due_date_from),
      });
    }

    if (due_date_to) {
      queryBuilder.andWhere('task.due_date <= :due_date_to', {
        due_date_to: new Date(due_date_to),
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .orderBy(`task.${sort_by}`, sort_order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: [
        'department',
        'created_by_user',
        'assigned_to_user',
        'project',
        'tags',
        'tags.tag',
        'assignments',
        'assignments.user',
        'comments',
        'comments.user',
        'attachments',
        'attachments.uploaded_by_user',
        'status_history',
        'status_history.changed_by_user',
        'subtasks',
      ],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task> {
    const task = await this.findOne(id);

    // Check if status is changing
    const statusChanged = updateTaskDto.status && updateTaskDto.status !== task.status;

    // Handle tags update
    if (updateTaskDto.tag_ids !== undefined) {
      await this.taskTagRepository.delete({ task_id: id });

      if (updateTaskDto.tag_ids.length > 0) {
        const tags = await this.tagRepository.findByIds(updateTaskDto.tag_ids);
        for (const tag of tags) {
          const taskTag = this.taskTagRepository.create({
            task_id: id,
            tag_id: tag.id,
          });
          await this.taskTagRepository.save(taskTag);
        }
      }
    }

    const {
      status,
      priority,
      due_date,
      start_date,
      estimated_hours,
      parent_task_id,
      assigned_to,
      title,
      description,
      progress,
      project_id,
    } = updateTaskDto;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status as TaskStatus;
    if (priority !== undefined) updateData.priority = priority as TaskPriority;
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
    if (estimated_hours !== undefined) updateData.estimated_hours = estimated_hours;
    if (parent_task_id !== undefined) updateData.parent_task_id = parent_task_id;
    if (due_date !== undefined) updateData.due_date = due_date ? new Date(due_date) : null;
    if (start_date !== undefined) updateData.start_date = start_date ? new Date(start_date) : null;
    if (progress !== undefined) updateData.progress = progress;
    if (project_id !== undefined) updateData.project_id = project_id;

    await this.taskRepository.update(id, updateData);

    // Create status history if status changed
    if (statusChanged) {
      await this.taskStatusHistoryRepository.save({
        task_id: id,
        from_status: task.status,
        to_status: status as TaskStatus,
        changed_by: userId,
        changed_at: new Date(),
      });
    }

    // Update completed_at if task is completed
    if (status === TaskStatus.COMPLETED) {
      await this.taskRepository.update(id, { completed_at: new Date() });
    }

    // Update project progress
    const updatedTask = await this.findOne(id);
    if (updatedTask.project_id) {
      await this.updateProjectProgress(Number(updatedTask.project_id));
    }

    return updatedTask;
  }

  async updateStatus(id: number, updateTaskStatusDto: UpdateTaskStatusDto, userId: number): Promise<Task> {
    const task = await this.findOne(id);
    const newStatus = updateTaskStatusDto.status as TaskStatus;

    // Validate status transition
    if (!this.isValidStatusTransition(task.status, newStatus)) {
      throw new ForbiddenException(`Invalid status transition from ${task.status} to ${newStatus}`);
    }

    await this.taskRepository.update(id, { status: newStatus });

    // Create status history
    await this.taskStatusHistoryRepository.save({
      task_id: id,
      from_status: task.status,
      to_status: newStatus,
      changed_by: userId,
      changed_at: new Date(),
      reason: updateTaskStatusDto.reason,
    });

    // Update completed_at if task is completed
    if (newStatus === TaskStatus.COMPLETED) {
      await this.taskRepository.update(id, { completed_at: new Date() });
    }

    return this.findOne(id);
  }

  async assignUsers(id: number, assignTaskDto: AssignTaskDto, userId: number): Promise<Task> {
    const task = await this.findOne(id);

    // Get old assignments for audit log
    const oldAssignments = await this.taskAssignmentRepository.find({
      where: { task_id: id },
      relations: ['user'],
    });
    const oldAssignedUserIds = oldAssignments.map(a => a.user_id);

    // Clear existing assignments
    await this.taskAssignmentRepository.delete({ task_id: id });

    // Create new assignments
    for (const userIdToAssign of assignTaskDto.user_ids) {
      const assignment = this.taskAssignmentRepository.create({
        task_id: id,
        user_id: userIdToAssign,
        assigned_by: userId,
        assigned_at: new Date(),
        notes: assignTaskDto.notes,
      });
      await this.taskAssignmentRepository.save(assignment);
    }

    // Update primary assignee
    await this.taskRepository.update(id, { assigned_to: assignTaskDto.user_ids[0] });

    // Create audit log
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.ASSIGN,
      entity_type: 'Task',
      entity_id: id,
      old_values: {
        assigned_user_ids: oldAssignedUserIds,
      },
      new_values: {
        assigned_user_ids: assignTaskDto.user_ids,
        notes: assignTaskDto.notes,
      },
      description: `Assigned task "${task.title}" to ${assignTaskDto.user_ids.length} user(s)`,
      organization_id: task.department?.organization_id,
    });

    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id);

    // Check if user has permission to delete
    if (task.created_by !== userId) {
      throw new ForbiddenException('You do not have permission to delete this task');
    }

    const projectId = task.project_id;

    await this.taskRepository.delete(id);

    // Update project progress after task deletion
    if (projectId) {
      await this.updateProjectProgress(Number(projectId));
    }
  }

  async getOverdueTasks(): Promise<Task[]> {
    return this.taskRepository
      .createQueryBuilder('task')
      .where('task.due_date < :now', { now: new Date() })
      .andWhere('task.status NOT IN (:...completedStatuses)', {
        completedStatuses: [TaskStatus.COMPLETED, TaskStatus.CLOSED, TaskStatus.CANCELLED],
      })
      .leftJoinAndSelect('task.assigned_to_user', 'assigned_to_user')
      .leftJoinAndSelect('task.department', 'department')
      .getMany();
  }

  async getTasksByDepartment(departmentId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { department_id: departmentId },
      relations: ['assigned_to_user', 'department'],
    });
  }

  async getTasksByUser(userId: number): Promise<Task[]> {
    return this.taskRepository
      .createQueryBuilder('task')
      .where('task.assigned_to = :userId', { userId })
      .orWhere('task.created_by = :userId', { userId })
      .leftJoinAndSelect('task.department', 'department')
      .leftJoinAndSelect('task.assigned_to_user', 'assigned_to_user')
      .getMany();
  }

  private isValidStatusTransition(currentStatus: TaskStatus, newStatus: TaskStatus): boolean {
    const validTransitions: Record<TaskStatus, TaskStatus[]> = {
      [TaskStatus.DRAFT]: [TaskStatus.OPEN, TaskStatus.ASSIGNED],
      [TaskStatus.OPEN]: [TaskStatus.ASSIGNED, TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
      [TaskStatus.ASSIGNED]: [TaskStatus.IN_PROGRESS, TaskStatus.OPEN, TaskStatus.CANCELLED],
      [TaskStatus.IN_PROGRESS]: [TaskStatus.REVIEW, TaskStatus.COMPLETED, TaskStatus.ASSIGNED],
      [TaskStatus.REVIEW]: [TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED],
      [TaskStatus.COMPLETED]: [TaskStatus.CLOSED, TaskStatus.IN_PROGRESS],
      [TaskStatus.CLOSED]: [],
      [TaskStatus.CANCELLED]: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
  }
}
