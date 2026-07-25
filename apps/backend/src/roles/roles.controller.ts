import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/interfaces/success-response.interface';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermissions('roles:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 400, description: 'Role with this name already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @CurrentUser() currentUser: any,
  ): Promise<SuccessResponse> {
    const role = await this.rolesService.createRole(createRoleDto, currentUser);

    return {
      message: 'Role created successfully',
      statusCode: HttpStatus.CREATED,
      data: role,
    };
  }

  @Get()
  @RequirePermissions('roles:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(
    @Query('organizationId') organizationId?: number,
  ): Promise<SuccessResponse> {
    const roles = await this.rolesService.findAllRoles(organizationId);

    return {
      message: 'Roles retrieved successfully',
      statusCode: HttpStatus.OK,
      data: roles,
    };
  }

  @Get(':id')
  @RequirePermissions('roles:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const role = await this.rolesService.findOneRole(id);

    return {
      message: 'Role retrieved successfully',
      statusCode: HttpStatus.OK,
      data: role,
    };
  }

  @Patch(':id')
  @RequirePermissions('roles:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<SuccessResponse> {
    const role = await this.rolesService.updateRole(id, updateRoleDto);

    return {
      message: 'Role updated successfully',
      statusCode: HttpStatus.OK,
      data: role,
    };
  }

  @Delete(':id')
  @RequirePermissions('roles:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async remove(@Param('id') id: number): Promise<SuccessResponse> {
    await this.rolesService.removeRole(id);

    return {
      message: 'Role deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }

  @Post('assign')
  @RequirePermissions('roles:assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiResponse({ status: 200, description: 'Role assigned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  async assignToUser(
    @Body() assignRoleDto: AssignRoleDto,
  ): Promise<SuccessResponse> {
    const assignment = await this.rolesService.assignRoleToUser(assignRoleDto);

    return {
      message: 'Role assigned to user successfully',
      statusCode: HttpStatus.OK,
      data: assignment,
    };
  }

  @Delete('users/:userId/roles/:roleId')
  @RequirePermissions('roles:revoke')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove role from user' })
  @ApiResponse({ status: 200, description: 'Role removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async removeFromUser(
    @Param('userId') userId: number,
    @Param('roleId') roleId: number,
  ): Promise<SuccessResponse> {
    await this.rolesService.removeRoleFromUser(userId, roleId);

    return {
      message: 'Role removed from user successfully',
      statusCode: HttpStatus.OK,
      data: { userId, roleId },
    };
  }

  @Get('users/:userId')
  @RequirePermissions('roles:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user roles' })
  @ApiResponse({ status: 200, description: 'User roles retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserRoles(
    @Param('userId') userId: number,
  ): Promise<SuccessResponse> {
    const roles = await this.rolesService.getUserRoles(userId);

    return {
      message: 'User roles retrieved successfully',
      statusCode: HttpStatus.OK,
      data: roles,
    };
  }

  @Get(':id/permissions')
  @RequirePermissions('roles:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all permissions for a role' })
  @ApiResponse({ status: 200, description: 'Permissions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getRolePermissions(
    @Param('id') id: number,
  ): Promise<SuccessResponse> {
    const permissions = await this.rolesService.getRolePermissions(id);

    return {
      message: 'Role permissions retrieved successfully',
      statusCode: HttpStatus.OK,
      data: permissions,
    };
  }

  @Post(':id/permissions')
  @RequirePermissions('roles:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add permissions to a role' })
  @ApiResponse({ status: 200, description: 'Permissions added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async assignPermissions(
    @Param('id') id: number,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ): Promise<SuccessResponse> {
    const result = await this.rolesService.assignPermissionsToRole(
      id,
      assignPermissionsDto,
    );

    return {
      message: 'Permissions added to role successfully',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @Put(':id/permissions')
  @RequirePermissions('roles:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set all permissions for a role (replaces existing)' })
  @ApiResponse({ status: 200, description: 'Permissions set successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async setPermissions(
    @Param('id') id: number,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ): Promise<SuccessResponse> {
    const result = await this.rolesService.setRolePermissions(
      id,
      assignPermissionsDto,
    );

    return {
      message: 'Role permissions set successfully',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @Delete(':id/permissions')
  @RequirePermissions('roles:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove permissions from a role' })
  @ApiResponse({ status: 200, description: 'Permissions removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async removePermissions(
    @Param('id') id: number,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ): Promise<SuccessResponse> {
    await this.rolesService.removePermissionsFromRole(
      id,
      assignPermissionsDto.permission_ids,
    );

    return {
      message: 'Permissions removed from role successfully',
      statusCode: HttpStatus.OK,
      data: { roleId: id, removedCount: assignPermissionsDto.permission_ids.length },
    };
  }
}

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class PermissionsController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermissions('permissions:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  @ApiResponse({ status: 400, description: 'Permission already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<SuccessResponse> {
    const permission = await this.rolesService.createPermission(
      createPermissionDto,
    );

    return {
      message: 'Permission created successfully',
      statusCode: HttpStatus.CREATED,
      data: permission,
    };
  }

  @Get()
  @RequirePermissions('permissions:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'Permissions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(): Promise<SuccessResponse> {
    const permissions = await this.rolesService.findAllPermissions();

    return {
      message: 'Permissions retrieved successfully',
      statusCode: HttpStatus.OK,
      data: permissions,
    };
  }

  @Get(':id')
  @RequirePermissions('permissions:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get permission by ID' })
  @ApiResponse({ status: 200, description: 'Permission retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const permission = await this.rolesService.findOnePermission(id);

    return {
      message: 'Permission retrieved successfully',
      statusCode: HttpStatus.OK,
      data: permission,
    };
  }

  @Patch(':id')
  @RequirePermissions('permissions:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update permission' })
  @ApiResponse({ status: 200, description: 'Permission updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async update(
    @Param('id') id: number,
    @Body() updatePermissionDto: Partial<CreatePermissionDto>,
  ): Promise<SuccessResponse> {
    const permission = await this.rolesService.updatePermission(
      id,
      updatePermissionDto,
    );

    return {
      message: 'Permission updated successfully',
      statusCode: HttpStatus.OK,
      data: permission,
    };
  }

  @Delete(':id')
  @RequirePermissions('permissions:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete permission' })
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async remove(@Param('id') id: number): Promise<SuccessResponse> {
    await this.rolesService.removePermission(id);

    return {
      message: 'Permission deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }
}
