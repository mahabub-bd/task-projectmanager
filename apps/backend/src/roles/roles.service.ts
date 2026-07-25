import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { UserRole } from '../entities/user-role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  // Role methods
  async createRole(createRoleDto: CreateRoleDto, currentUser?: any): Promise<Role> {
    // Automatically set organization_id from authenticated user
    const roleData = {
      name: createRoleDto.name,
      description: createRoleDto.description,
      organization_id: currentUser?.organization_id || 1,
    };
    const role = this.roleRepository.create(roleData);

    if (createRoleDto.permission_ids && createRoleDto.permission_ids.length > 0) {
      const permissions = await this.permissionRepository.findByIds(createRoleDto.permission_ids);
      role.permissions = permissions;
    }

    return this.roleRepository.save(role);
  }

  async findAllRoles(organizationId?: number): Promise<Role[]> {
    const where = organizationId ? { organization_id: organizationId } : {};
    return this.roleRepository.find({
      where,
      relations: ['permissions', 'organization'],
    });
  }

  async findOneRole(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'organization', 'user_roles'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.findOneRole(id);

    if (updateRoleDto.permission_ids) {
      const permissions = await this.permissionRepository.findByIds(updateRoleDto.permission_ids);
      await this.roleRepository
        .createQueryBuilder()
        .relation(Role, 'permissions')
        .of(id)
        .add(permissions);
    }

    await this.roleRepository.update(id, {
      name: updateRoleDto.name,
      description: updateRoleDto.description,
    });

    return this.findOneRole(id);
  }

  async removeRole(id: number): Promise<void> {
    await this.findOneRole(id);
    await this.roleRepository.delete(id);
  }

  async assignRoleToUser(assignRoleDto: AssignRoleDto): Promise<UserRole> {
    const existing = await this.userRoleRepository.findOne({
      where: {
        user_id: assignRoleDto.user_id,
        role_id: assignRoleDto.role_id,
      },
    });

    if (existing) {
      throw new ConflictException('User already has this role');
    }

    const userRole = this.userRoleRepository.create({
      user_id: assignRoleDto.user_id,
      role_id: assignRoleDto.role_id,
      assigned_at: new Date(),
    });

    return this.userRoleRepository.save(userRole);
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await this.userRoleRepository.delete({
      user_id: userId,
      role_id: roleId,
    });
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { user_id: userId },
      relations: ['role', 'role.permissions'],
    });

    return userRoles.map((ur) => ur.role);
  }

  // Permission methods
  async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);

    return this.permissionRepository.save(permission);
  }

  async findAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find({
      relations: ['roles'],
    });
  }

  async findOnePermission(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async updatePermission(id: number, updatePermissionDto: Partial<CreatePermissionDto>): Promise<Permission> {
    await this.findOnePermission(id);
    await this.permissionRepository.update(id, updatePermissionDto);
    return this.findOnePermission(id);
  }

  async removePermission(id: number): Promise<void> {
    await this.findOnePermission(id);
    await this.permissionRepository.delete(id);
  }

  // Role Permission methods
  async getRolePermissions(roleId: number): Promise<Permission[]> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role.permissions;
  }

  async assignPermissionsToRole(roleId: number, assignPermissionsDto: AssignPermissionsDto): Promise<Role> {
    await this.findOneRole(roleId);
    const permissions = await this.permissionRepository.findBy({
      id: In(assignPermissionsDto.permission_ids),
    });

    await this.roleRepository
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(roleId)
      .add(permissions);

    return this.findOneRole(roleId);
  }

  async removePermissionsFromRole(roleId: number, permissionIds: number[]): Promise<Role> {
    const role = await this.findOneRole(roleId);

    role.permissions = role.permissions.filter(
      (perm) => !permissionIds.includes(perm.id)
    );

    return this.roleRepository.save(role);
  }

  async setRolePermissions(roleId: number, assignPermissionsDto: AssignPermissionsDto): Promise<Role> {
    const role = await this.findOneRole(roleId);

    // Clear existing permissions first
    role.permissions = [];
    await this.roleRepository.save(role);

    // Fetch and set new permissions
    const permissions = await this.permissionRepository.findBy({
      id: In(assignPermissionsDto.permission_ids),
    });

    role.permissions = permissions;
    return this.roleRepository.save(role);
  }
}
