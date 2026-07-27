import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
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
  UseInterceptors,
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
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post()
  @RequirePermissions('projects:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const project = await this.projectsService.create(createProjectDto, userId);

    return {
      message: 'Project created successfully',
      statusCode: HttpStatus.CREATED,
      data: project,
    };
  }

  @Get()
  @RequirePermissions('projects:read')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60) // Cache for 1 minute (shorter for lists)
  @ApiOperation({ summary: 'Get all projects with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(@Query() query: QueryProjectsDto): Promise<SuccessResponse> {
    const result = await this.projectsService.findAll(query);

    return {
      message: 'Projects retrieved successfully',
      statusCode: HttpStatus.OK,
      data: {
        items: result.data,
        total: result.total,
      },
    };
  }

  @Get('active/:organizationId')
  @RequirePermissions('projects:read')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(120) // Cache for 2 minutes
  @ApiOperation({ summary: 'Get active projects for an organization' })
  @ApiResponse({ status: 200, description: 'Active projects retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getActiveProjects(
    @Param('organizationId') organizationId: number,
  ): Promise<SuccessResponse> {
    const projects = await this.projectsService.getActiveProjects(organizationId);

    return {
      message: 'Active projects retrieved successfully',
      statusCode: HttpStatus.OK,
      data: projects,
    };
  }

  @Get('upcoming/:organizationId')
  @RequirePermissions('projects:read')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(120)
  @ApiOperation({ summary: 'Get upcoming projects for an organization' })
  @ApiResponse({ status: 200, description: 'Upcoming projects retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getUpcomingProjects(
    @Param('organizationId') organizationId: number,
  ): Promise<SuccessResponse> {
    const projects = await this.projectsService.getUpcomingProjects(organizationId);

    return {
      message: 'Upcoming projects retrieved successfully',
      statusCode: HttpStatus.OK,
      data: projects,
    };
  }

  @Get('overdue/:organizationId')
  @RequirePermissions('projects:read')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(120)
  @ApiOperation({ summary: 'Get overdue projects for an organization' })
  @ApiResponse({ status: 200, description: 'Overdue projects retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getOverdueProjects(
    @Param('organizationId') organizationId: number,
  ): Promise<SuccessResponse> {
    const projects = await this.projectsService.getOverdueProjects(organizationId);

    return {
      message: 'Overdue projects retrieved successfully',
      statusCode: HttpStatus.OK,
      data: projects,
    };
  }

  @Get(':id')
  @RequirePermissions('projects:read')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(
    @Param('id') id: number,
    @Query('relations') relations?: string,
  ): Promise<SuccessResponse> {
    const relationsArray = relations ? relations.split(',') : undefined;
    const project = await this.projectsService.findOne(id, relationsArray);

    return {
      message: 'Project retrieved successfully',
      statusCode: HttpStatus.OK,
      data: project,
    };
  }

  @Get(':id/stats')
  @RequirePermissions('projects:read')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(180) // Cache for 3 minutes
  @ApiOperation({ summary: 'Get project statistics' })
  @ApiResponse({ status: 200, description: 'Project statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProjectStats(@Param('id') id: number): Promise<SuccessResponse> {
    const stats = await this.projectsService.getProjectStats(id);

    return {
      message: 'Project statistics retrieved successfully',
      statusCode: HttpStatus.OK,
      data: stats,
    };
  }

  @Patch(':id')
  @RequirePermissions('projects:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const project = await this.projectsService.update(id, updateProjectDto, userId);

    return {
      message: 'Project updated successfully',
      statusCode: HttpStatus.OK,
      data: project,
    };
  }

  @Patch(':id/progress')
  @RequirePermissions('projects:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update project progress based on tasks' })
  @ApiResponse({ status: 200, description: 'Project progress updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async updateProgress(@Param('id') id: number): Promise<SuccessResponse> {
    const project = await this.projectsService.updateProjectProgress(id);

    return {
      message: 'Project progress updated successfully',
      statusCode: HttpStatus.OK,
      data: project,
    };
  }

  @Delete(':id')
  @RequirePermissions('projects:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async remove(
    @Param('id') id: number,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    await this.projectsService.remove(id, userId);

    return {
      message: 'Project deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }

  @Post(':id/members')
  @RequirePermissions('projects:update')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add member to project' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async addMember(
    @Param('id') id: number,
    @Body() addMemberDto: AddProjectMemberDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const member = await this.projectsService.addMember(id, addMemberDto, userId);

    return {
      message: 'Member added successfully',
      statusCode: HttpStatus.CREATED,
      data: member,
    };
  }

  @Get(':id/members')
  @RequirePermissions('projects:read')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(180)
  @ApiOperation({ summary: 'Get project members' })
  @ApiResponse({ status: 200, description: 'Project members retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getMembers(@Param('id') id: number): Promise<SuccessResponse> {
    const members = await this.projectsService.getMembers(id);

    return {
      message: 'Project members retrieved successfully',
      statusCode: HttpStatus.OK,
      data: members,
    };
  }

  @Get('list/:organizationId')
  @RequirePermissions('projects:read')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // Cache for 5 minutes (dropdown data changes rarely)
  @ApiOperation({ summary: 'Get simplified project list for dropdowns' })
  @ApiResponse({ status: 200, description: 'Project list retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getSimpleList(
    @Param('organizationId') organizationId: number,
  ): Promise<SuccessResponse> {
    const projects = await this.projectsService.getSimpleList(organizationId);

    return {
      message: 'Project list retrieved successfully',
      statusCode: HttpStatus.OK,
      data: projects,
    };
  }

  @Delete(':id/members/:memberId')
  @RequirePermissions('projects:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove member from project' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Project or member not found' })
  async removeMember(
    @Param('id') id: number,
    @Param('memberId') memberId: number,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    await this.projectsService.removeMember(id, memberId, userId);

    return {
      message: 'Member removed successfully',
      statusCode: HttpStatus.OK,
      data: { id, memberId },
    };
  }
}
