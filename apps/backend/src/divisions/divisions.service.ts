import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Division } from '../entities/division.entity';
import { Department } from '../entities/department.entity';
import { User } from '../entities/user.entity';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { QueryDivisionsDto } from './dto/query-divisions.dto';

@Injectable()
export class DivisionsService {
  constructor(
    @InjectRepository(Division)
    private divisionRepository: Repository<Division>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDivisionDto: CreateDivisionDto, currentUser?: any): Promise<Division> {
    // Verify parent division exists if provided
    if (createDivisionDto.parent_division_id) {
      const parent = await this.divisionRepository.findOne({
        where: { id: createDivisionDto.parent_division_id },
      });
      if (!parent) {
        throw new NotFoundException('Parent division not found');
      }
    }

    // Automatically set organization_id from authenticated user
    const divisionData = {
      ...createDivisionDto,
      organization_id: currentUser?.organization_id || 1,
    };
    const division = this.divisionRepository.create(divisionData);
    return this.divisionRepository.save(division);
  }

  async findAll(query: QueryDivisionsDto): Promise<{ data: any[]; total: number }> {
    const {
      organization_id,
      status,
      search,
      page = 1,
      limit = 20,
    } = query;

    const queryBuilder = this.divisionRepository
      .createQueryBuilder('division')
      .leftJoinAndSelect('division.organization', 'organization')
      .leftJoinAndSelect('division.parent', 'parent')
      .leftJoinAndSelect('division.children', 'children')
      .leftJoinAndSelect('division.departments', 'departments');

    if (organization_id) {
      queryBuilder.andWhere('division.organization_id = :organization_id', { organization_id });
    }

    if (status) {
      queryBuilder.andWhere('division.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(division.name LIKE :search OR division.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('division.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // Get user counts for each division
    const divisionsWithCounts = await Promise.all(
      data.map(async (division) => {
        const userCount = await this.userRepository
          .createQueryBuilder('user')
          .leftJoin('user.department', 'department')
          .where('department.division_id = :divisionId', { divisionId: division.id })
          .getCount();

        return {
          ...division,
          users_count: userCount,
        };
      })
    );

    return { data: divisionsWithCounts, total };
  }

  async findOne(id: number): Promise<Division> {
    const division = await this.divisionRepository.findOne({
      where: { id },
      relations: ['organization', 'parent', 'children', 'departments'],
    });

    if (!division) {
      throw new NotFoundException(`Division with ID ${id} not found`);
    }

    return division;
  }

  async getTree(organizationId: number): Promise<any[]> {
    const divisions = await this.divisionRepository
      .createQueryBuilder('div')
      .leftJoinAndSelect('div.children', 'children')
      .leftJoinAndSelect('div.departments', 'departments')
      .where('div.organization_id = :organizationId', { organizationId })
      .andWhere('div.parent_division_id IS NULL')
      .getMany();

    // Recursively add user counts to divisions and children
    const addUserCounts = async (divisions: Division[]): Promise<any[]> => {
      return Promise.all(
        divisions.map(async (division) => {
          const userCount = await this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.department', 'department')
            .where('department.division_id = :divisionId', { divisionId: division.id })
            .getCount();

          return {
            ...division,
            users_count: userCount,
            children: division.children ? await addUserCounts(division.children) : [],
          };
        })
      );
    };

    return addUserCounts(divisions);
  }

  async update(id: number, updateDivisionDto: UpdateDivisionDto): Promise<Division> {
    await this.findOne(id);

    if (updateDivisionDto.parent_division_id) {
      const parent = await this.divisionRepository.findOne({
        where: { id: updateDivisionDto.parent_division_id },
      });
      if (!parent) {
        throw new NotFoundException('Parent division not found');
      }
    }

    await this.divisionRepository.update(id, updateDivisionDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const division = await this.findOne(id);

    // Check if division has children
    if (division.children && division.children.length > 0) {
      throw new ConflictException('Cannot delete division with child divisions');
    }

    // Check if division has departments
    if (division.departments && division.departments.length > 0) {
      throw new ConflictException('Cannot delete division with departments');
    }

    await this.divisionRepository.delete(id);
  }

  async getDepartments(divisionId: number): Promise<Department[]> {
    await this.findOne(divisionId); // Verify division exists

    const departments = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.users', 'users')
      .where('department.division_id = :divisionId', { divisionId })
      .getMany();

    return departments;
  }

  async findAllSimple(organizationId?: number): Promise<Array<{ id: number; name: string }>> {
    const queryBuilder = this.divisionRepository
      .createQueryBuilder('division')
      .select(['division.id', 'division.name']);

    if (organizationId) {
      queryBuilder.andWhere('division.organization_id = :organizationId', { organizationId });
    }

    const divisions = await queryBuilder
      .orderBy('division.name', 'ASC')
      .getMany();

    return divisions.map(div => ({
      id: div.id,
      name: div.name,
    }));
  }
}
