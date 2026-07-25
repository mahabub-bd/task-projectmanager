import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../entities/audit-log.entity';
import { Phase } from '../entities/phase.entity';
import { PhaseStatus } from '../common/enum';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { QueryPhasesDto } from './dto/query-phases.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';

@Injectable()
export class PhasesService {
  constructor(
    @InjectRepository(Phase)
    private phaseRepository: Repository<Phase>,
    private auditLogsService: AuditLogsService,
  ) { }

  async create(createPhaseDto: CreatePhaseDto, userId: number): Promise<Phase> {
    const phase = this.phaseRepository.create({
      ...createPhaseDto,
      start_date: createPhaseDto.start_date ? new Date(createPhaseDto.start_date) : null,
      end_date: createPhaseDto.end_date ? new Date(createPhaseDto.end_date) : null,
      due_date: createPhaseDto.due_date ? new Date(createPhaseDto.due_date) : null,
    });

    const savedPhase = await this.phaseRepository.save(phase);

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.CREATE,
      entity_type: 'phase',
      entity_id: Number(savedPhase.id),
      organization_id: createPhaseDto.organization_id,
      metadata: { phase_name: savedPhase.name },
    });

    return this.findOne(Number(savedPhase.id));
  }

  async findAll(query: QueryPhasesDto): Promise<{ data: Phase[]; total: number }> {
    const {
      organization_id,
      project_id,
      status,
      search,
      page = 1,
      limit = 20,
      sort_by = 'order',
      sort_order = 'ASC',
    } = query;

    const queryBuilder = this.phaseRepository
      .createQueryBuilder('phase')
      .leftJoinAndSelect('phase.project', 'project')
      .where('1=1');

    if (organization_id) {
      queryBuilder.andWhere('phase.organization_id = :organization_id', { organization_id });
    }

    if (project_id) {
      queryBuilder.andWhere('phase.project_id = :project_id', { project_id });
    }

    if (status) {
      queryBuilder.andWhere('phase.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere('phase.name LIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await queryBuilder
      .orderBy(`phase.${sort_by}`, sort_order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Phase> {
    const phase = await this.phaseRepository.findOne({
      where: { id },
      relations: ['project', 'milestones'],
    });

    if (!phase) {
      throw new NotFoundException(`Phase with ID ${id} not found`);
    }

    return phase;
  }

  async update(id: number, updatePhaseDto: UpdatePhaseDto, userId: number): Promise<Phase> {
    const phase = await this.phaseRepository.findOne({
      where: { id },
    });

    if (!phase) {
      throw new NotFoundException(`Phase with ID ${id} not found`);
    }

    const updateData: any = { ...updatePhaseDto };

    if (updatePhaseDto.start_date) {
      updateData.start_date = new Date(updatePhaseDto.start_date);
    }

    if (updatePhaseDto.end_date) {
      updateData.end_date = new Date(updatePhaseDto.end_date);
    }

    if (updatePhaseDto.due_date) {
      updateData.due_date = new Date(updatePhaseDto.due_date);
    }

    // Use update() instead of merge() to properly update foreign keys
    await this.phaseRepository.update(id, updateData);

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.UPDATE,
      entity_type: 'phase',
      entity_id: id,
      organization_id: phase.organization_id,
      old_values: { name: phase.name, status: phase.status },
      new_values: { name: updatePhaseDto.name || phase.name, status: updatePhaseDto.status || phase.status },
    });

    // Return the phase with relations
    return this.findOne(Number(id));
  }

  async remove(id: number, userId: number): Promise<void> {
    const phase = await this.findOne(id);

    await this.phaseRepository.remove(phase);

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.DELETE,
      entity_type: 'phase',
      entity_id: id,
      organization_id: phase.organization_id,
      metadata: { phase_name: phase.name },
    });
  }

  async getPhasesByProject(projectId: number): Promise<Phase[]> {
    return this.phaseRepository.find({
      where: { project_id: projectId },
      relations: ['milestones'],
      order: { order: 'ASC' },
    });
  }

  async updatePhaseProgress(id: number): Promise<Phase> {
    const phase = await this.findOne(id);

    // Calculate progress from milestones
    if (phase.milestones && phase.milestones.length > 0) {
      const totalProgress = phase.milestones.reduce((sum, milestone) => sum + (milestone.progress || 0), 0);
      const avgProgress = Math.round(totalProgress / phase.milestones.length);

      await this.phaseRepository.update(id, { progress: avgProgress });

      // Auto-update phase status based on milestones
      const allCompleted = phase.milestones.every(m => m.status === 'completed');
      const anyInProgress = phase.milestones.some(m => m.status === 'in_progress');

      let newStatus: PhaseStatus = phase.status;
      if (allCompleted && phase.status !== PhaseStatus.COMPLETED) {
        newStatus = PhaseStatus.COMPLETED;
      } else if (anyInProgress && phase.status === PhaseStatus.NOT_STARTED) {
        newStatus = PhaseStatus.IN_PROGRESS;
      }

      if (newStatus !== phase.status) {
        await this.phaseRepository.update(id, { status: newStatus });
      }

      return this.findOne(id);
    }

    return phase;
  }
}
