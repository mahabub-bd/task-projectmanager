import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../entities/audit-log.entity';
import { ProjectMember } from '../entities/project-member.entity';
import { ProjectStatusHistory } from '../entities/project-status-history.entity';
import { Project, ProjectStatus } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationService as EmailNotificationService } from '../email/notification.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectStatusHistory)
    private projectStatusHistoryRepository: Repository<ProjectStatusHistory>,
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
    private auditLogsService: AuditLogsService,
    private notificationsService: NotificationsService,
    private emailNotificationService: EmailNotificationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: number): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      start_date: createProjectDto.start_date ? new Date(createProjectDto.start_date) : null,
      end_date: createProjectDto.end_date ? new Date(createProjectDto.end_date) : null,
      due_date: createProjectDto.due_date ? new Date(createProjectDto.due_date) : null,
    });

    const savedProject = await this.projectRepository.save(project);

    // Create initial status history
    await this.projectStatusHistoryRepository.insert({
      project_id: Number(savedProject.id),
      from_status: null,
      to_status: savedProject.status,
      changed_by: Number(userId),
      changed_at: new Date(),
      reason: 'Project created',
    });

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.CREATE,
      entity_type: 'project',
      entity_id: Number(savedProject.id),
      organization_id: createProjectDto.organization_id,
      metadata: { project_name: savedProject.name },
    });

    return this.findOne(Number(savedProject.id));
  }

  async findAll(query: QueryProjectsDto): Promise<{ data: Project[]; total: number }> {
    const {
      organization_id,
      manager_id,
      status,
      search,
      page = 1,
      limit = 20,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = query;

    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.manager', 'manager')
      .leftJoinAndSelect('project.organization', 'organization')
      .leftJoinAndSelect('project.milestones', 'milestones')
      .leftJoinAndSelect('project.phases', 'phases')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .where('1=1');

    if (organization_id) {
      queryBuilder.andWhere('project.organization_id = :organization_id', { organization_id });
    }

    if (manager_id) {
      queryBuilder.andWhere('project.manager_id = :manager_id', { manager_id });
    }

    if (status) {
      queryBuilder.andWhere('project.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere('project.name LIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await queryBuilder
      .orderBy(`project.${sort_by}`, sort_order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: number, relations?: string[]): Promise<any> {
    // Check cache first
    const cacheKey = `project:${id}:${relations?.join(',') || 'full'}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Determine which relations to load based on request
    // Default minimal relations for better performance
    const loadRelations = relations || ['manager', 'organization'];

    // Build query with only needed relations
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.manager', 'manager')
      .leftJoinAndSelect('project.organization', 'organization');

    // Conditionally add relations based on what's requested
    if (loadRelations.includes('milestones')) {
      queryBuilder.leftJoinAndSelect('project.milestones', 'milestones');
    }
    if (loadRelations.includes('phases')) {
      queryBuilder.leftJoinAndSelect('project.phases', 'phases');
    }
    if (loadRelations.includes('tasks')) {
      queryBuilder.leftJoinAndSelect('project.tasks', 'tasks');
    }
    if (loadRelations.includes('members')) {
      queryBuilder.leftJoinAndSelect('project.members', 'members')
        .leftJoinAndSelect('members.user', 'memberUser')
        .leftJoinAndSelect('members.department', 'department');
    }
    if (loadRelations.includes('status_history')) {
      queryBuilder.leftJoinAndSelect('project.status_history', 'statusHistory')
        .leftJoinAndSelect('statusHistory.changed_by_user', 'changedByUser')
        .orderBy('statusHistory.changed_at', 'DESC');
    }

    const project = await queryBuilder
      .where('project.id = :id', { id })
      .getOne();

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Remove sensitive data from user objects before returning
    if (project.manager) {
      const { password_hash, ...managerData } = project.manager as any;
      (project as any).manager = managerData;
    }
    if (project.members) {
      project.members = project.members.map((member: any) => ({
        ...member,
        user: member.user ? { ...member.user, password_hash: undefined } : null,
      }));
    }
    if (project.status_history) {
      // Limit status history to last 10 entries
      (project as any).status_history = project.status_history.slice(0, 10).map((history: any) => ({
        ...history,
        changed_by_user: history.changed_by_user ? { ...history.changed_by_user, password_hash: undefined } : null,
      }));
    }

    // Cache the result for 5 minutes
    await this.cacheManager.set(cacheKey, project, 300);

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number): Promise<Project> {
    // Load project with relations to get members and manager
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['members', 'members.user', 'manager', 'phases'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // If manager relation is null but manager_id exists, try to load the manager
    if (!project.manager && project.manager_id) {
      console.log(`[Project Update] Manager relation is null but manager_id exists: ${project.manager_id}. Attempting to load manager separately.`);
      try {
        const { User } = await import('../entities/user.entity');
        const userRepository = this.projectRepository.manager.getRepository(User);
        const manager = await userRepository.findOne({ where: { id: project.manager_id } });
        if (manager) {
          project.manager = manager;
          console.log(`[Project Update] Successfully loaded manager: ${manager.id} (${manager.email})`);
        }
      } catch (error) {
        console.error(`[Project Update] Failed to load manager separately:`, error);
      }
    }

    const updateData: any = { ...updateProjectDto };

    if (updateProjectDto.start_date) {
      updateData.start_date = new Date(updateProjectDto.start_date);
    }

    if (updateProjectDto.end_date) {
      updateData.end_date = new Date(updateProjectDto.end_date);
    }

    if (updateProjectDto.due_date) {
      updateData.due_date = new Date(updateProjectDto.due_date);
    }

    // Track status change
    if (updateProjectDto.status && updateProjectDto.status !== project.status) {
      await this.projectStatusHistoryRepository.insert({
        project_id: Number(id),
        from_status: project.status,
        to_status: updateProjectDto.status,
        changed_by: Number(userId),
        changed_at: new Date(),
        reason: updateProjectDto.status_change_reason || 'Status updated',
      });
    }

    // Use update() instead of save() to avoid cascade issues
    await this.projectRepository.update(id, updateData);

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.UPDATE,
      entity_type: 'project',
      entity_id: id,
      organization_id: project.organization_id,
      old_values: { name: project.name, status: project.status },
      new_values: { name: updateProjectDto.name || project.name, status: updateProjectDto.status || project.status },
    });

    // Send notifications to all project members (except the updater)
    const projectName = updateProjectDto.name || project.name;
    const projectMembers = project.members || [];
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

    console.log(`[Project Update] Project ID: ${id}, Members count: ${projectMembers.length}`);

    // Build list of changes
    const changes: string[] = [];
    if (updateProjectDto.name && updateProjectDto.name !== project.name) {
      changes.push(`Name changed to "${updateProjectDto.name}"`);
    }
    if (updateProjectDto.status && updateProjectDto.status !== project.status) {
      changes.push(`Status changed to "${updateProjectDto.status}"`);
    }
    if (updateProjectDto.description && updateProjectDto.description !== project.description) {
      changes.push('Description updated');
    }
    if (updateProjectDto.start_date) {
      changes.push(`Start date updated to ${updateProjectDto.start_date}`);
    }
    if (updateProjectDto.end_date) {
      changes.push(`End date updated to ${updateProjectDto.end_date}`);
    }
    if (updateProjectDto.due_date) {
      changes.push(`Due date updated to ${updateProjectDto.due_date}`);
    }

    console.log(`[Project Update] Changes: ${changes.join(', ')}`);

    // Log project manager info
    console.log(`[Project Update] Project manager:`, {
      hasManager: !!project.manager,
      managerId: project.manager?.id,
      managerName: project.manager?.name,
      managerEmail: project.manager?.email,
      currentUserId: userId,
    });

    // Collect all users to notify (members + manager, excluding the updater)
    const usersToNotify = new Map<number, User>();

    // Add project members
    for (const member of projectMembers) {
      console.log(`[Project Update] Processing member: ${JSON.stringify({ memberId: member.id, userId: member.user_id, hasUser: !!member.user })}`);
      if (member.user && member.user.id !== userId) {
        usersToNotify.set(member.user.id, member.user);
      } else {
        console.log(`[Project Update] Skipping member - no user or is the updater`);
      }
    }

    // Add project manager if different from updater and not already in the list
    console.log(`[Project Update] Checking if manager should be added:`, {
      hasManager: !!project.manager,
      managerId: project.manager?.id,
      isNotUpdater: project.manager?.id !== userId,
      notInList: !usersToNotify.has(project.manager?.id || 0),
    });

    if (project.manager && project.manager.id !== userId && !usersToNotify.has(project.manager.id)) {
      console.log(`[Project Update] Adding project manager to notification list: ${project.manager.id} (${project.manager.email})`);
      usersToNotify.set(project.manager.id, project.manager);
    } else {
      console.log(`[Project Update] Manager not added - conditions not met`);
    }

    console.log(`[Project Update] Total users to notify: ${usersToNotify.size}`);
    console.log(`[Project Update] Users to notify:`, Array.from(usersToNotify.keys()).map(id => ({
      id,
      email: usersToNotify.get(id)?.email,
      name: usersToNotify.get(id)?.name,
    })));

    // Send notifications to all collected users
    for (const [userIdToNotify, user] of usersToNotify) {
      try {
        console.log(`[Project Update] Sending notification to user ${userIdToNotify} (${user.email})`);

        // Send in-app notification
        await this.notificationsService.notifyProjectUpdated(
          userIdToNotify,
          project.organization_id,
          projectName,
          id,
          'System',
        );
        console.log(`[Project Update] In-app notification sent to user ${userIdToNotify}`);

        // Send email notification
        if (user.email) {
          await this.emailNotificationService.sendProjectUpdatedNotification(
            user.email,
            user.name || user.email.split('@')[0],
            projectName,
            changes.length > 0 ? changes : ['Project details updated'],
            `${frontendUrl}/projects/${id}`,
          );
          console.log(`[Project Update] Email notification sent to ${user.email}`);
        }
      } catch (error) {
        console.error(`[Project Update] Failed to send notification to user ${userIdToNotify}:`, error);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const project = await this.findOne(id);

    await this.projectRepository.remove(project);

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.DELETE,
      entity_type: 'project',
      entity_id: id,
      organization_id: project.organization_id,
      metadata: { project_name: project.name },
    });
  }

  async getActiveProjects(organizationId: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: {
        organization_id: organizationId,
        status: ProjectStatus.ACTIVE,
      },
      relations: ['manager', 'organization', 'milestones', 'phases', 'tasks'],
      order: { created_at: 'DESC' },
    });
  }

  async getUpcomingProjects(organizationId: number): Promise<Project[]> {
    const now = new Date();

    return this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.manager', 'manager')
      .leftJoinAndSelect('project.organization', 'organization')
      .leftJoinAndSelect('project.milestones', 'milestones')
      .leftJoinAndSelect('project.phases', 'phases')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .where('project.organization_id = :organizationId', { organizationId })
      .andWhere('project.status = :status', { status: ProjectStatus.ACTIVE })
      .andWhere('project.due_date >= :now', { now })
      .orderBy('project.due_date', 'ASC')
      .getMany();
  }

  async getOverdueProjects(organizationId: number): Promise<Project[]> {
    const now = new Date();

    return this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.manager', 'manager')
      .leftJoinAndSelect('project.organization', 'organization')
      .leftJoinAndSelect('project.milestones', 'milestones')
      .leftJoinAndSelect('project.phases', 'phases')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .where('project.organization_id = :organizationId', { organizationId })
      .andWhere('project.status = :status', { status: ProjectStatus.ACTIVE })
      .andWhere('project.due_date < :now', { now })
      .orderBy('project.due_date', 'ASC')
      .getMany();
  }

  async updateProjectProgress(id: number): Promise<Project> {
    const project = await this.findOne(id);

    if (!project.tasks || project.tasks.length === 0) {
      return project;
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((task) => task.status === 'completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    project.progress = progress;
    project.task_count = totalTasks;
    project.milestone_count = project.milestones?.length || 0;

    if (progress === 100 && project.status !== ProjectStatus.COMPLETED) {
      project.status = ProjectStatus.COMPLETED;
    } else if (progress > 0 && progress < 100 && project.status === ProjectStatus.PLANNING) {
      project.status = ProjectStatus.ACTIVE;
    }

    return this.projectRepository.save(project);
  }

  async getProjectStats(projectId: number): Promise<{
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    totalMilestones: number;
    completedMilestones: number;
  }> {
    // Optimized: Use aggregation queries instead of loading all data
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['tasks', 'milestones'],
      select: ['id'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const tasks = project.tasks || [];
    const milestones = project.milestones || [];

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;

    const now = new Date();
    const overdueTasks = tasks.filter(
      (t) => t.due_date && new Date(t.due_date) < now && t.status !== 'completed' && t.status !== 'closed'
    ).length;

    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter((m) => m.status === 'completed').length;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      totalMilestones,
      completedMilestones,
    };
  }

  async addMember(projectId: number, addMemberDto: AddProjectMemberDto, userId: number): Promise<ProjectMember> {
    const project = await this.findOne(projectId);

    // Check if user_id is already a member
    if (addMemberDto.user_id) {
      const existingMember = await this.projectMemberRepository.findOne({
        where: {
          project_id: projectId,
          user_id: addMemberDto.user_id,
        },
      });
      if (existingMember) {
        throw new NotFoundException('User is already a member of this project');
      }
    }

    // Check if department_id is already a member
    if (addMemberDto.department_id) {
      const existingMember = await this.projectMemberRepository.findOne({
        where: {
          project_id: projectId,
          department_id: addMemberDto.department_id,
        },
      });
      if (existingMember) {
        throw new NotFoundException('Department is already a member of this project');
      }
    }

    const member = this.projectMemberRepository.create({
      project_id: projectId,
      user_id: addMemberDto.user_id || null,
      department_id: addMemberDto.department_id || null,
      role: addMemberDto.role,
      notes: addMemberDto.notes,
      joined_at: new Date(),
    });

    const savedMember = await this.projectMemberRepository.save(member);

    // Create status history entry for activity timeline
    const memberName = addMemberDto.user_id
      ? project.members?.find((m: any) => m.user_id === addMemberDto.user_id)?.user?.name
      : project.members?.find((m: any) => m.department_id === addMemberDto.department_id)?.department?.name;

    await this.projectStatusHistoryRepository.save({
      project_id: projectId,
      from_status: null,
      to_status: project.status,
      changed_by: userId,
      changed_at: new Date(),
      reason: `Added ${memberName || 'member'} as ${addMemberDto.role}`,
      metadata: {
        action: 'member_added',
        member_id: savedMember.id,
        user_id: addMemberDto.user_id,
        department_id: addMemberDto.department_id,
        role: addMemberDto.role,
      },
    });

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.CREATE,
      entity_type: 'project_member',
      entity_id: projectId,
      organization_id: project.organization_id,
      metadata: {
        member_id: savedMember.id,
        user_id: addMemberDto.user_id,
        department_id: addMemberDto.department_id,
        role: addMemberDto.role,
      },
    });

    return savedMember;
  }

  async removeMember(projectId: number, memberId: number, userId: number): Promise<void> {
    const member = await this.projectMemberRepository.findOne({
      where: { id: memberId, project_id: projectId },
    });

    if (!member) {
      throw new NotFoundException('Project member not found');
    }

    await this.projectMemberRepository.remove(member);

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.DELETE,
      entity_type: 'project_member',
      entity_id: projectId,
      organization_id: member.project?.organization_id || 0,
      metadata: {
        member_id: memberId,
        user_id: member.user_id,
        department_id: member.department_id,
      },
    });
  }

  async getMembers(projectId: number): Promise<ProjectMember[]> {
    // Optimized: Query members directly with proper joins
    const members = await this.projectMemberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .leftJoinAndSelect('member.department', 'department')
      .where('member.project_id = :projectId', { projectId })
      .getMany();

    return members;
  }

  async getSimpleList(organizationId: number): Promise<Array<{ id: number; name: string }>> {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .select(['project.id', 'project.name'])
      .where('project.organization_id = :organizationId', { organizationId })
      .orderBy('project.name', 'ASC')
      .getMany();

    return projects;
  }
}
