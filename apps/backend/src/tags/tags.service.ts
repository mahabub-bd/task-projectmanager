import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../entities/audit-log.entity';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private auditLogsService: AuditLogsService,
  ) {}

  async create(createTagDto: CreateTagDto, userId: number): Promise<Tag> {
    const tag = this.tagRepository.create({
      ...createTagDto,
      organization_id: createTagDto.organization_id,
    });

    const savedTag = await this.tagRepository.save(tag);

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.CREATE,
      entity_type: 'tag',
      entity_id: Number(savedTag.id),
      organization_id: createTagDto.organization_id,
      metadata: { tag_name: savedTag.name },
    });

    return savedTag;
  }

  async findAll(organization_id?: number, search?: string): Promise<Tag[]> {
    const where: any = {};

    if (organization_id) {
      where.organization_id = organization_id;
    }

    if (search) {
      where.name = Like(`%${search}%`);
    }

    return this.tagRepository.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto, userId: number): Promise<Tag> {
    const tag = await this.findOne(id);

    // Check if user belongs to the organization
    // This is a simplified check - you may want to verify organization membership

    const updatedTag = this.tagRepository.merge(tag, updateTagDto);
    const savedTag = await this.tagRepository.save(updatedTag);

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.UPDATE,
      entity_type: 'tag',
      entity_id: id,
      organization_id: tag.organization_id,
      old_values: { name: tag.name },
      new_values: { name: updateTagDto.name || tag.name },
    });

    return savedTag;
  }

  async remove(id: number, userId: number): Promise<void> {
    const tag = await this.findOne(id);

    // Check if user belongs to the organization
    // This is a simplified check - you may want to verify organization membership

    await this.tagRepository.remove(tag);

    // Log the action
    await this.auditLogsService.create({
      user_id: userId,
      action: AuditAction.DELETE,
      entity_type: 'tag',
      entity_id: id,
      organization_id: tag.organization_id,
      metadata: { tag_name: tag.name },
    });
  }
}
