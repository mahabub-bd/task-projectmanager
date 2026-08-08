import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { In, Like, Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../entities/audit-log.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UpdateUserDto } from './update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly auditLogsService: AuditLogsService,
  ) { }

  // Private method to get full user entity for internal use
  private async findUserEntity(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['organization', 'department', 'department.division', 'designation', 'user_roles', 'user_roles.role'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Private method to format user object for API response
  private formatUserForResponse(user: User): any {
    return {
      id: user.id,
      created_at: user.created_at,
      updated_at: user.updated_at,
      name: user.name,
      email: user.email,
      employee_id: user.employee_id,
      phone_number: user.phone_number,
      status: user.status,
      avatar_url: user.avatar_url,
      bio: user.bio,
      address: user.address,
      organization_id: user.organization_id,
      department_id: user.department_id,
      designation_id: user.designation_id,
      is_verified: user.is_verified,
      is_online: user.is_online,
      last_seen_at: user.last_seen_at,
      organization: user.organization ? {
        id: user.organization.id,
        name: user.organization.name,
        logo_url: user.organization.logo_url,
        dark_logo_url: user.organization.dark_logo_url,
        light_logo_url: user.organization.light_logo_url,
      } : null,
      department: user.department ? {
        id: user.department.id,
        name: user.department.name,
        division: user.department.division ? {
          id: user.department.division.id,
          name: user.department.division.name,
        } : null,
      } : null,
      designation: user.designation ? {
        id: user.designation.id,
        name: user.designation.name,
      } : null,
      user_roles: user.user_roles?.map((ur: any) => ({
        id: ur.id,
        role: {
          id: ur.role.id,
          name: ur.role.name,
        },
      })) || [],
    };
  }

  async create(createUserDto: CreateUserDto, currentUser?: any): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check if employee_id already exists
    if (createUserDto.employee_id) {
      const existingEmployeeId = await this.userRepository.findOne({
        where: { employee_id: createUserDto.employee_id },
      });
      if (existingEmployeeId) {
        throw new ConflictException('Employee ID already exists');
      }
    }

    // Hash the password
    const password_hash = await bcrypt.hash(createUserDto.password, 10);

    // Automatically set organization_id from authenticated user
    const userData = {
      name: createUserDto.name,
      email: createUserDto.email,
      employee_id: createUserDto.employee_id,
      password_hash,
      organization_id: currentUser?.organization_id || 1,
      department_id: createUserDto.department_id,
      designation_id: createUserDto.designation_id,
      status: createUserDto.status,
    };
    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);

    // Create audit log
    await this.auditLogsService.create({
      user_id: currentUser?.id,
      action: AuditAction.CREATE,
      entity_type: 'User',
      entity_id: savedUser.id,
      new_values: {
        name: savedUser.name,
        email: savedUser.email,
        employee_id: savedUser.employee_id,
        department_id: savedUser.department_id,
        designation_id: savedUser.designation_id,
        status: savedUser.status,
      },
      description: `Created user "${savedUser.name}" (${savedUser.email})`,
      organization_id: savedUser.organization_id,
    });

    return savedUser;
  }

  async findAll(query: QueryUsersDto): Promise<{ items: any[]; total: number }> {
    const {
      department_id,
      organization_id,
      status,
      search,
      page = 1,
      limit = 20,
    } = query;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('department.division', 'division')
      .leftJoinAndSelect('user.designation', 'designation')
      .leftJoinAndSelect('user.user_roles', 'user_roles')
      .leftJoinAndSelect('user_roles.role', 'role');

    if (department_id) {
      queryBuilder.andWhere('user.department_id = :department_id', { department_id });
    }

    if (organization_id) {
      queryBuilder.andWhere('user.organization_id = :organization_id', { organization_id });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.name LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('user.employee_id', 'ASC')
      .addOrderBy('user.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: data.map(user => this.formatUserForResponse(user)),
      total,
    };
  }

  async findOne(id: number): Promise<any> {
    const user = await this.findUserEntity(id);
    return this.formatUserForResponse(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser?: any): Promise<any> {
    // Get old user data for audit log
    const oldUser = await this.findUserEntity(id);

    // Check if employee_id already exists (only if changing to a different value)
    if (updateUserDto.employee_id !== undefined && updateUserDto.employee_id !== oldUser.employee_id) {
      const existingEmployeeId = await this.userRepository.findOne({
        where: { employee_id: updateUserDto.employee_id },
      });
      if (existingEmployeeId) {
        throw new ConflictException('Employee ID already exists');
      }
    }

    // Check if email already exists (only if changing to a different value)
    if (updateUserDto.email !== oldUser.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already registered');
      }
    }

    // Hash password if provided
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password_hash = await bcrypt.hash(updateUserDto.password, 10);
      delete updateData.password;
    }

    // Remove undefined values to prevent setting them to NULL
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await this.userRepository.update(id, updateData);
    const updatedUser = await this.findUserEntity(id);

    // Create audit log with only changed values
    const oldValues: Record<string, any> = {};
    const newValues: Record<string, any> = {};

    Object.keys(updateData).forEach(key => {
      if (oldUser[key as keyof User] !== updatedUser[key as keyof User]) {
        oldValues[key] = oldUser[key as keyof User];
        newValues[key] = updatedUser[key as keyof User];
      }
    });

    await this.auditLogsService.create({
      user_id: currentUser?.id,
      action: AuditAction.UPDATE,
      entity_type: 'User',
      entity_id: id,
      old_values: Object.keys(oldValues).length > 0 ? oldValues : undefined,
      new_values: Object.keys(newValues).length > 0 ? newValues : undefined,
      description: `Updated user "${updatedUser.name}" (${updatedUser.email})`,
      organization_id: updatedUser.organization_id,
    });

    return this.formatUserForResponse(updatedUser);
  }

  async remove(id: number, currentUser?: any): Promise<void> {
    const user = await this.findOne(id);
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Create audit log
    await this.auditLogsService.create({
      user_id: currentUser?.id,
      action: AuditAction.DELETE,
      entity_type: 'User',
      entity_id: id,
      old_values: {
        name: user.name,
        email: user.email,
      },
      description: `Deleted user "${user.name}" (${user.email})`,
      organization_id: user.organization_id,
    });
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { user_id: userId },
      relations: ['role'],
    });

    return userRoles.map((ur) => ur.role);
  }

  async setUserRoles(userId: number, assignRolesDto: AssignRolesDto, currentUser?: any): Promise<any> {
    // Verify user exists
    const user = await this.findUserEntity(userId);

    // Get old roles for audit log
    const oldUserRoles = await this.getUserRoles(userId);

    // Verify all roles exist
    const roles = await this.roleRepository.findBy({
      id: In(assignRolesDto.role_ids),
    });

    if (roles.length !== assignRolesDto.role_ids.length) {
      throw new NotFoundException('One or more roles not found');
    }

    // Delete existing user roles
    await this.userRoleRepository.delete({ user_id: userId });

    // Create new user roles
    const userRoles = assignRolesDto.role_ids.map((role_id) =>
      this.userRoleRepository.create({
        user_id: userId,
        role_id,
        assigned_at: new Date(),
      })
    );

    await this.userRoleRepository.save(userRoles);

    // Create audit log
    await this.auditLogsService.create({
      user_id: currentUser?.id,
      action: AuditAction.ASSIGN,
      entity_type: 'UserRole',
      entity_id: userId,
      old_values: {
        roles: oldUserRoles.map(r => r.name),
      },
      new_values: {
        roles: roles.map(r => r.name),
      },
      description: `Updated roles for user "${user.name}" (${user.email})`,
      organization_id: user.organization_id,
    });

    // Return updated user with new roles
    const updatedUser = await this.findUserEntity(userId);
    return this.formatUserForResponse(updatedUser);
  }

  async findAllSimple(organizationId?: number): Promise<Array<{ id: number; name: string }>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name']);

    if (organizationId) {
      queryBuilder.andWhere('user.organization_id = :organizationId', { organizationId });
    }

    const users = await queryBuilder
      .where('user.status = :status', { status: 'active' })
      .orderBy('user.name', 'ASC')
      .getMany();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
    }));
  }

  async findByDepartment(departmentId: number): Promise<Array<{ id: number; name: string }>> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name'])
      .where('user.department_id = :departmentId', { departmentId })
      .andWhere('user.status = :status', { status: 'active' })
      .orderBy('user.name', 'ASC')
      .getMany();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
    }));
  }

  async getOnlineUsers(organizationId: number): Promise<Array<{
    id: number;
    name: string;
    email: string;
    avatar_url: string | null;
    last_seen_at: Date | null;
  }>> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.avatar_url', 'user.last_seen_at'])
      .where('user.organization_id = :organizationId', { organizationId })
      .andWhere('user.is_online = :isOnline', { isOnline: true })
      .andWhere('user.status = :status', { status: 'active' })
      .orderBy('user.last_seen_at', 'DESC')
      .getMany();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      last_seen_at: user.last_seen_at,
    }));
  }

  async getDirectory(query: QueryUsersDto): Promise<{ data: User[]; total: number }> {
    const {
      department_id,
      designation_id,
      organization_id,
      status,
      search,
      page = 1,
      limit = 20,
    } = query;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('department.division', 'division')
      .leftJoinAndSelect('user.designation', 'designation')
      .leftJoinAndSelect('user.user_roles', 'user_roles')
      .leftJoinAndSelect('user_roles.role', 'role');

    if (organization_id) {
      queryBuilder.andWhere('user.organization_id = :organization_id', { organization_id });
    }

    if (department_id) {
      queryBuilder.andWhere('user.department_id = :department_id', { department_id });
    }

    if (designation_id) {
      queryBuilder.andWhere('user.designation_id = :designation_id', { designation_id });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.name LIKE :search OR user.email LIKE :search OR user.phone_number LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('user.employee_id', 'ASC')
      .addOrderBy('user.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async exportDirectoryExcel(query: QueryUsersDto): Promise<string> {
    // Get all users without pagination for export
    const result = await this.getDirectory({
      ...query,
      page: 1,
      limit: 10000, // Export all records
    });

    // Create CSV header
    const headers = ['Name', 'Email', 'Phone', 'Address', 'Department', 'Division', 'Designation', 'Status', 'Roles'];

    // Create CSV rows
    const rows = result.data.map((user) => {
      const department = user.department?.name || '';
      const division = user.department?.division?.name || '';
      const designation = user.designation?.name || '';
      const roles = user.user_roles?.map((ur: any) => ur.role.name).join(', ') || '';
      const phone = user.phone_number || '';
      const address = user.address || '';

      // Escape CSV values
      const escapeCsv = (value: string) => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };

      return [
        escapeCsv(user.name),
        escapeCsv(user.email),
        escapeCsv(phone),
        escapeCsv(address),
        escapeCsv(department),
        escapeCsv(division),
        escapeCsv(designation),
        user.status,
        escapeCsv(roles),
      ].join(',');
    });

    // Combine header and rows
    return [headers.join(','), ...rows].join('\n');
  }

  async exportDirectoryPdf(query: QueryUsersDto): Promise<Buffer> {
    // Get all users without pagination for export
    const result = await this.getDirectory({
      ...query,
      page: 1,
      limit: 10000, // Export all records
    });

    // Create simple PDF content as text (for compatibility without external PDF libraries)
    let pdfContent = 'ADDRESS BOOK\n';
    pdfContent += '=' .repeat(80) + '\n\n';
    pdfContent += `Generated on: ${new Date().toLocaleString()}\n`;
    pdfContent += `Total Contacts: ${result.data.length}\n\n`;
    pdfContent += '=' .repeat(80) + '\n\n';

    result.data.forEach((user, index) => {
      pdfContent += `${index + 1}. ${user.name}\n`;
      pdfContent += `   Email: ${user.email}\n`;
      if (user.phone_number) pdfContent += `   Phone: ${user.phone_number}\n`;
      if (user.address) pdfContent += `   Address: ${user.address}\n`;
      if (user.department) pdfContent += `   Department: ${user.department.name}\n`;
      if (user.department?.division) pdfContent += `   Division: ${user.department.division.name}\n`;
      if (user.designation) pdfContent += `   Designation: ${user.designation.name}\n`;
      pdfContent += `   Status: ${user.status}\n`;
      if (user.user_roles && user.user_roles.length > 0) {
        pdfContent += `   Roles: ${user.user_roles.map((ur: any) => ur.role.name).join(', ')}\n`;
      }
      pdfContent += '\n';
    });

    // Create a simple text file (will be saved as .pdf but plain text for now)
    // For proper PDF generation, you would need to install pdfkit or similar
    return Buffer.from(pdfContent, 'utf-8');
  }
}
