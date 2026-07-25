import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(data: {
    user_id?: number;
    action: AuditAction;
    entity_type: string;
    entity_id: number;
    old_values?: Record<string, any>;
    new_values?: Record<string, any>;
    description?: string;
    ip_address?: string;
    user_agent?: string;
    metadata?: Record<string, any>;
    organization_id?: number;
  }): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(data);
    return this.auditLogRepository.save(auditLog);
  }

  async findAll(query: QueryAuditLogsDto): Promise<{ data: AuditLog[]; total: number }> {
    const {
      user_id,
      entity_type,
      entity_id,
      action,
      organization_id,
      date_from,
      date_to,
      page = 1,
      limit = 50,
    } = query;

    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit_log')
      .leftJoinAndSelect('audit_log.user', 'user');

    if (user_id) {
      queryBuilder.andWhere('audit_log.user_id = :user_id', { user_id });
    }

    if (entity_type) {
      queryBuilder.andWhere('audit_log.entity_type = :entity_type', { entity_type });
    }

    if (entity_id) {
      queryBuilder.andWhere('audit_log.entity_id = :entity_id', { entity_id });
    }

    if (action) {
      queryBuilder.andWhere('audit_log.action = :action', { action });
    }

    if (organization_id) {
      queryBuilder.andWhere('audit_log.organization_id = :organization_id', { organization_id });
    }

    if (date_from && date_to) {
      queryBuilder.andWhere('audit_log.created_at BETWEEN :date_from AND :date_to', {
        date_from: new Date(date_from),
        date_to: new Date(date_to),
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('audit_log.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<AuditLog> {
    const auditLog = await this.auditLogRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!auditLog) {
      throw new Error(`Audit log with ID ${id} not found`);
    }

    return auditLog;
  }

  async findByEntity(entityType: string, entityId: number): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { entity_type: entityType, entity_id: entityId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUser(userId: number, limit = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { user_id: userId },
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}
