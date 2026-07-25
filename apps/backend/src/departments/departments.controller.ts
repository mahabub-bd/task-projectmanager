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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/interfaces/success-response.interface';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { QueryDepartmentsDto } from './dto/query-departments.dto';

@ApiTags('Departments')
@Controller('departments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @RequirePermissions('departments:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, description: 'Department created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @CurrentUser() currentUser: any,
  ): Promise<SuccessResponse> {
    const department = await this.departmentsService.create(
      createDepartmentDto,
      currentUser,
    );

    return {
      message: 'Department created successfully',
      statusCode: HttpStatus.CREATED,
      data: department,
    };
  }

  @Get()
  @RequirePermissions('departments:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all departments with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Departments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(@Query() query: QueryDepartmentsDto): Promise<SuccessResponse> {
    const result = await this.departmentsService.findAll(query);

    return {
      message: 'Departments retrieved successfully',
      statusCode: HttpStatus.OK,
      data: {
        items: result.data,
        total: result.total,
      },
    };
  }

  @Get('list')
  @RequirePermissions('departments:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get simple department list (id and name only)' })
  @ApiQuery({ name: 'organization_id', required: false })
  @ApiResponse({ status: 200, description: 'Department list retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAllSimple(@Query('organization_id') organizationId?: number): Promise<SuccessResponse> {
    const departments = await this.departmentsService.findAllSimple(organizationId);

    return {
      message: 'Department list retrieved successfully',
      statusCode: HttpStatus.OK,
      data: departments,
    };
  }

  @Get('tree')
  @RequirePermissions('departments:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get department tree' })
  @ApiQuery({ name: 'organizationId', required: true })
  @ApiResponse({ status: 200, description: 'Department tree retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getTree(@Query('organizationId') organizationId: number): Promise<SuccessResponse> {
    const tree = await this.departmentsService.getTree(organizationId);

    return {
      message: 'Department tree retrieved successfully',
      statusCode: HttpStatus.OK,
      data: tree || [],
    };
  }

  @Get(':id')
  @RequirePermissions('departments:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get department by ID' })
  @ApiResponse({ status: 200, description: 'Department retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const department = await this.departmentsService.findOne(id);

    return {
      message: 'Department retrieved successfully',
      statusCode: HttpStatus.OK,
      data: department,
    };
  }

  @Get(':id/projects')
  @RequirePermissions('departments:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get projects for a department' })
  @ApiResponse({ status: 200, description: 'Department projects retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async getProjects(@Param('id') id: number): Promise<SuccessResponse> {
    const projects = await this.departmentsService.getProjects(id);

    return {
      message: 'Department projects retrieved successfully',
      statusCode: HttpStatus.OK,
      data: projects || [],
    };
  }

  @Get(':id/tasks')
  @RequirePermissions('departments:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tasks for a department' })
  @ApiResponse({ status: 200, description: 'Department tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async getTasks(@Param('id') id: number): Promise<SuccessResponse> {
    const tasks = await this.departmentsService.getTasks(id);

    return {
      message: 'Department tasks retrieved successfully',
      statusCode: HttpStatus.OK,
      data: tasks || [],
    };
  }

  @Patch(':id')
  @RequirePermissions('departments:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update department' })
  @ApiResponse({ status: 200, description: 'Department updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async update(
    @Param('id') id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<SuccessResponse> {
    const department = await this.departmentsService.update(id, updateDepartmentDto);

    return {
      message: 'Department updated successfully',
      statusCode: HttpStatus.OK,
      data: department,
    };
  }

  @Delete(':id')
  @RequirePermissions('departments:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete department' })
  @ApiResponse({ status: 200, description: 'Department deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async remove(@Param('id') id: number): Promise<SuccessResponse> {
    await this.departmentsService.remove(id);

    return {
      message: 'Department deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }
}
