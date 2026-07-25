import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { Division } from '../entities/division.entity';
import { ProjectMember } from '../entities/project-member.entity';
import { Task } from '../entities/task.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { QueryDepartmentsDto } from './dto/query-departments.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Division)
    private divisionRepository: Repository<Division>,
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto, currentUser?: any): Promise<Department> {
    // Verify division exists if provided
    if (createDepartmentDto.division_id) {
      const division = await this.divisionRepository.findOne({
        where: { id: createDepartmentDto.division_id },
      });
      if (!division) {
        throw new NotFoundException('Division not found');
      }
    }

    // Automatically set organization_id from authenticated user
    const departmentData = {
      ...createDepartmentDto,
      organization_id: currentUser?.organization_id || 1,
    };
    const department = this.departmentRepository.create(departmentData);
    return this.departmentRepository.save(department);
  }

  async findAll(query: QueryDepartmentsDto): Promise<{ data: Department[]; total: number }> {
    const {
      organization_id,
      division_id,
      status,
      search,
      page = 1,
      limit = 20,
    } = query;

    const queryBuilder = this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.organization', 'organization')
      .leftJoinAndSelect('department.division', 'division')
      .leftJoinAndSelect('department.users', 'users');

    if (organization_id) {
      queryBuilder.andWhere('department.organization_id = :organization_id', { organization_id });
    }

    if (division_id) {
      queryBuilder.andWhere('department.division_id = :division_id', { division_id });
    }

    if (status) {
      queryBuilder.andWhere('department.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(department.name LIKE :search OR department.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('department.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['organization', 'division', 'users', 'tasks'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async getTree(organizationId: number): Promise<Department[]> {
    // Return flat list of departments organized by division
    return this.departmentRepository
      .createQueryBuilder('dept')
      .leftJoinAndSelect('dept.division', 'division')
      .where('dept.organization_id = :organizationId', { organizationId })
      .orderBy('division.name', 'ASC')
      .addOrderBy('dept.name', 'ASC')
      .getMany();
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    await this.findOne(id);

    if (updateDepartmentDto.division_id) {
      const division = await this.divisionRepository.findOne({
        where: { id: updateDepartmentDto.division_id },
      });
      if (!division) {
        throw new NotFoundException('Division not found');
      }
    }

    await this.departmentRepository.update(id, updateDepartmentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.departmentRepository.delete(id);
  }

  async getProjects(departmentId: number): Promise<any[]> {
    await this.findOne(departmentId); // Verify department exists

    const projectMembers = await this.projectMemberRepository
      .createQueryBuilder('pm')
      .leftJoinAndSelect('pm.project', 'project')
      .leftJoinAndSelect('project.manager', 'manager')
      .where('pm.department_id = :departmentId', { departmentId })
      .getMany();

    // Extract unique projects
    const projectsMap = new Map();
    projectMembers.forEach((pm) => {
      if (pm.project && !projectsMap.has(pm.project.id)) {
        projectsMap.set(pm.project.id, pm.project);
      }
    });

    return Array.from(projectsMap.values());
  }

  async getTasks(departmentId: number): Promise<any[]> {
    await this.findOne(departmentId); // Verify department exists

    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assigned_to_user', 'assigned_to_user')
      .where('task.department_id = :departmentId', { departmentId })
      .getMany();

    return tasks;
  }

  async findAllSimple(organizationId?: number): Promise<Array<{ id: number; name: string }>> {
    const queryBuilder = this.departmentRepository
      .createQueryBuilder('department')
      .select(['department.id', 'department.name']);

    if (organizationId) {
      queryBuilder.andWhere('department.organization_id = :organizationId', { organizationId });
    }

    const departments = await queryBuilder
      .orderBy('department.name', 'ASC')
      .getMany();

    return departments.map(dept => ({
      id: dept.id,
      name: dept.name,
    }));
  }
}
