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
  Res,
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
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { SuccessResponse } from '../common/interfaces/success-response.interface';
import { CreateUserDto } from './create-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('users:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() currentUser: any,
  ): Promise<SuccessResponse> {
    const user = await this.usersService.create(createUserDto, currentUser);
     return {
      message: 'User created successfully',
      statusCode: HttpStatus.CREATED,
      data: user,
    };
  }

  @Get()
  @RequirePermissions('users:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(@Query() query: QueryUsersDto): Promise<SuccessResponse> {
    const result = await this.usersService.findAll(query);

    return {
      message: 'Users retrieved successfully',
      statusCode: HttpStatus.OK,
      data: {
        items: result.data,
        total: result.total,
      },
    };
  }

  @Get('list')
  @RequirePermissions('users:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get simple user list (id and name only) without pagination' })
  @ApiResponse({ status: 200, description: 'User list retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAllSimple(@Query('organization_id') organizationId?: number): Promise<SuccessResponse> {
    const users = await this.usersService.findAllSimple(organizationId);

    return {
      message: 'User list retrieved successfully',
      statusCode: HttpStatus.OK,
      data: users,
    };
  }

  @Get('directory')
  @RequirePermissions('users:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get organization directory with contact information' })
  @ApiResponse({ status: 200, description: 'Directory retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getDirectory(@Query() query: QueryUsersDto): Promise<SuccessResponse> {
    const result = await this.usersService.getDirectory(query);

    return {
      message: 'Directory retrieved successfully',
      statusCode: HttpStatus.OK,
      data: {
        items: result.data,
        total: result.total,
      },
    };
  }

  @Get('directory/export/excel')
  @RequirePermissions('users:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export directory to Excel/CSV format' })
  @ApiResponse({ status: 200, description: 'Directory exported successfully', type: 'text/csv' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async exportDirectoryExcel(
    @Query() query: QueryUsersDto,
    @Res() res: any,
  ): Promise<void> {
    const csv = await this.usersService.exportDirectoryExcel(query);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="address-book-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  }

  @Get('directory/export/pdf')
  @RequirePermissions('users:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export directory to PDF format' })
  @ApiResponse({ status: 200, description: 'Directory exported successfully', type: 'application/pdf' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async exportDirectoryPdf(
    @Query() query: QueryUsersDto,
    @Res() res: any,
  ): Promise<void> {
    const pdfBuffer = await this.usersService.exportDirectoryPdf(query);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="address-book-${new Date().toISOString().split('T')[0]}.pdf"`);
    res.send(pdfBuffer);
  }

  @Get('online')
  @RequirePermissions('users:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all online users' })
  @ApiResponse({ status: 200, description: 'Online users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getOnlineUsers(@CurrentUser() user: any): Promise<SuccessResponse> {
    const onlineUsers = await this.usersService.getOnlineUsers(user.organization_id);

    return {
      message: 'Online users retrieved successfully',
      statusCode: HttpStatus.OK,
      data: onlineUsers,
    };
  }

  @Get('department/:departmentId')
  @RequirePermissions('users:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get users by department ID (id and name only) without pagination' })
  @ApiResponse({ status: 200, description: 'Department users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async findByDepartment(@Param('departmentId') departmentId: number): Promise<SuccessResponse> {
    const users = await this.usersService.findByDepartment(departmentId);

    return {
      message: 'Department users retrieved successfully',
      statusCode: HttpStatus.OK,
      data: users,
    };
  }

  @Get(':id')
  @RequirePermissions('users:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const user = await this.usersService.findOne(id);

    return {
      message: 'User retrieved successfully',
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Patch(':id')
  @RequirePermissions('users:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: any,
  ): Promise<SuccessResponse> {
    const user = await this.usersService.update(id, updateUserDto, currentUser);

    return {
      message: 'User updated successfully',
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Delete(':id')
  @RequirePermissions('users:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(
    @Param('id') id: number,
    @CurrentUser() currentUser: any,
  ): Promise<SuccessResponse> {
    await this.usersService.remove(id, currentUser);

    return {
      message: 'User deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }

  @Get(':id/roles')
  @RequirePermissions('users:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user roles' })
  @ApiResponse({ status: 200, description: 'User roles retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserRoles(@Param('id') id: number): Promise<SuccessResponse> {
    const roles = await this.usersService.getUserRoles(id);

    return {
      message: 'User roles retrieved successfully',
      statusCode: HttpStatus.OK,
      data: roles,
    };
  }

  @Put(':id/roles')
  @RequirePermissions('users:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set user roles' })
  @ApiResponse({ status: 200, description: 'User roles updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async setUserRoles(
    @Param('id') id: number,
    @Body() assignRolesDto: AssignRolesDto,
    @CurrentUser() currentUser: any,
  ): Promise<SuccessResponse> {
    const user = await this.usersService.setUserRoles(id, assignRolesDto, currentUser);

    return {
      message: 'User roles updated successfully',
      statusCode: HttpStatus.OK,
      data: user,
    };
  }
}
