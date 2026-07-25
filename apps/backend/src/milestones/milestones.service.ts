import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../entities/audit-log.entity';
import { Milestone } from '../entities/milestone.entity';
import { MilestoneStatusHistory } from '../entities/milestone-status-history.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { QueryMilestonesDto } from './dto/query-milestones.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { MilestoneStatus } from '../common/enum';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
    @InjectRepository(MilestoneStatusHistory)
    private statusHistoryRepository: Repository<MilestoneStatusHistory>,
    private auditLogsService: AuditLogsService,
  ) { }

  async create(createMilestoneDto: CreateMilestoneDto, userId: number): Promise<Milestone> {
    const milestone = this.milestoneRepository.create({
      ...createMilestoneDto,
      start_date: createMilestoneDto.start_date ? new Date(createMilestoneDto.start_date) : null,
      end_date: createMilestoneDto.end_date ? new Date(createMilestoneDto.end_date) : null,
      due_date: createMilestoneDto.due_date ? new Date(createMilestoneDto.due_date) : null,
    });

    const savedMilestone = await this.milestoneRepository.save(milestone);

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.CREATE,
      entity_type: 'milestone',
      entity_id: Number(savedMilestone.id),
      organization_id: createMilestoneDto.organization_id,
      metadata: { milestone_name: savedMilestone.name },
    });

    return this.findOne(Number(savedMilestone.id));
  }

  async findAll(query: QueryMilestonesDto): Promise<{ data: Milestone[]; total: number }> {
    const {
      organization_id,
      project_id,
      status,
      search,
      page = 1,
      limit = 20,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = query;

    const queryBuilder = this.milestoneRepository
      .createQueryBuilder('milestone')
      .leftJoinAndSelect('milestone.project', 'project')

      .where('1=1');

    if (organization_id) {
      queryBuilder.andWhere('milestone.organization_id = :organization_id', { organization_id });
    }

    if (project_id) {
      queryBuilder.andWhere('milestone.project_id = :project_id', { project_id });
    }

    if (status) {
      queryBuilder.andWhere('milestone.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere('milestone.name LIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await queryBuilder
      .orderBy(`milestone.${sort_by}`, sort_order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Milestone> {
    const milestone = await this.milestoneRepository.findOne({
      where: { id },
      relations: ['project', 'status_history', 'status_history.changed_by_user'],
    });

    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }

    return milestone;
  }

  async update(id: number, updateMilestoneDto: UpdateMilestoneDto, userId: number): Promise<Milestone> {
    const milestone = await this.milestoneRepository.findOne({
      where: { id },
    });

    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }

    const updateData: any = { ...updateMilestoneDto };

    if (updateMilestoneDto.start_date) {
      updateData.start_date = new Date(updateMilestoneDto.start_date);
    }

    if (updateMilestoneDto.end_date) {
      updateData.end_date = new Date(updateMilestoneDto.end_date);
    }

    if (updateMilestoneDto.due_date) {
      updateData.due_date = new Date(updateMilestoneDto.due_date);
    }

    // Track status change
    const oldStatus = milestone.status;
    const newStatus = updateMilestoneDto.status;

    // Use update() instead of merge() to properly update foreign keys
    await this.milestoneRepository.update(id, updateData);

    // Create status history if status changed
    if (newStatus && newStatus !== oldStatus) {
      const statusHistory = this.statusHistoryRepository.create({
        milestone_id: id,
        from_status: oldStatus,
        to_status: newStatus,
        changed_by: userId,
        changed_at: new Date(),
        reason: null,
        metadata: null,
      });
      await this.statusHistoryRepository.save(statusHistory);
    }

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.UPDATE,
      entity_type: 'milestone',
      entity_id: id,
      organization_id: milestone.organization_id,
      old_values: { name: milestone.name, status: milestone.status },
      new_values: { name: updateMilestoneDto.name || milestone.name, status: updateMilestoneDto.status || milestone.status },
    });

    // Return the milestone with relations
    return this.findOne(Number(id));
  }

  async remove(id: number, userId: number): Promise<void> {
    const milestone = await this.findOne(id);

    await this.milestoneRepository.remove(milestone);

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.DELETE,
      entity_type: 'milestone',
      entity_id: id,
      organization_id: milestone.organization_id,
      metadata: { milestone_name: milestone.name },
    });
  }

  async getUpcomingMilestones(organizationId: number): Promise<Milestone[]> {
    const now = new Date();

    return this.milestoneRepository.find({
      where: {
        organization_id: organizationId,
        status: MilestoneStatus.IN_PROGRESS,
        due_date: MoreThanOrEqual(now),
      },
      relations: ['project'],
      order: { due_date: 'ASC' },
      take: 5,
    });
  }

  async getOverdueMilestones(organizationId: number): Promise<Milestone[]> {
    const now = new Date();

    return this.milestoneRepository.find({
      where: {
        organization_id: organizationId,
        status: MilestoneStatus.IN_PROGRESS,
        due_date: LessThan(now),
      },
      relations: ['project'],
      order: { due_date: 'ASC' },
    });
  }

  async updateMilestoneProgress(id: number): Promise<Milestone> {
    // Here you would calculate progress based on tasks
    // For now, just return the milestone with relations
    return this.findOne(id);
  }
}
