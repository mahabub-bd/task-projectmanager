import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Designation } from '../entities/designation.entity';
import { Department } from '../entities/department.entity';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { QueryDesignationsDto } from './dto/query-designations.dto';

@Injectable()
export class DesignationsService {
  constructor(
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createDesignationDto: CreateDesignationDto, currentUser?: any): Promise<Designation> {
    // Verify department exists if provided
    if (createDesignationDto.department_id) {
      const department = await this.departmentRepository.findOne({
        where: { id: createDesignationDto.department_id },
      });
      if (!department) {
        throw new NotFoundException('Department not found');
      }
    }

    // Automatically set organization_id from authenticated user
    const designationData = {
      ...createDesignationDto,
      organization_id: currentUser?.organization_id || 1,
    };
    const designation = this.designationRepository.create(designationData);
    return this.designationRepository.save(designation);
  }

  async findAll(query: QueryDesignationsDto): Promise<{ data: Designation[]; total: number }> {
    const {
      organization_id,
      department_id,
      status,
      search,
      page = 1,
      limit = 20,
    } = query;

    const queryBuilder = this.designationRepository
      .createQueryBuilder('designation')
      .leftJoinAndSelect('designation.organization', 'organization')
      .leftJoinAndSelect('designation.department', 'department')
      .leftJoinAndSelect('designation.users', 'users');

    if (organization_id) {
      queryBuilder.andWhere('designation.organization_id = :organization_id', { organization_id });
    }

    if (department_id) {
      queryBuilder.andWhere('designation.department_id = :department_id', { department_id });
    }

    if (status) {
      queryBuilder.andWhere('designation.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(designation.name LIKE :search OR designation.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('designation.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Designation> {
    const designation = await this.designationRepository.findOne({
      where: { id },
      relations: ['organization', 'department', 'users'],
    });

    if (!designation) {
      throw new NotFoundException(`Designation with ID ${id} not found`);
    }
    return designation;
  }

  async update(id: number, updateDesignationDto: UpdateDesignationDto): Promise<Designation> {
    await this.findOne(id);

    if (updateDesignationDto.department_id) {
      const department = await this.departmentRepository.findOne({
        where: { id: updateDesignationDto.department_id },
      });
      if (!department) {
        throw new NotFoundException('Department not found');
      }
    }

    await this.designationRepository.update(id, updateDesignationDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.designationRepository.delete(id);
  }

  async findAllSimple(organizationId?: number): Promise<Array<{ id: number; name: string }>> {
    const queryBuilder = this.designationRepository
      .createQueryBuilder('designation')
      .select(['designation.id', 'designation.name']);

    if (organizationId) {
      queryBuilder.andWhere('designation.organization_id = :organizationId', { organizationId });
    }

    const designations = await queryBuilder
      .orderBy('designation.name', 'ASC')
      .getMany();

    return designations.map(d => ({
      id: d.id,
      name: d.name,
    }));
  }
}
