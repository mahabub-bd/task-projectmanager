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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/interfaces/success-response.interface';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { QueryPhasesDto } from './dto/query-phases.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { PhasesService } from './phases.service';

@ApiTags('Phases')
@Controller('phases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class PhasesController {
  constructor(private readonly phasesService: PhasesService) { }

  @Post()
  @RequirePermissions('phases:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new phase' })
  @ApiResponse({ status: 201, description: 'Phase created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(
    @Body() createPhaseDto: CreatePhaseDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const phase = await this.phasesService.create(createPhaseDto, userId);

    return {
      message: 'Phase created successfully',
      statusCode: HttpStatus.CREATED,
      data: phase,
    };
  }

  @Get()
  @RequirePermissions('phases:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all phases with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Phases retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(@Query() query: QueryPhasesDto): Promise<SuccessResponse> {
    const result = await this.phasesService.findAll(query);

    return {
      message: 'Phases retrieved successfully',
      statusCode: HttpStatus.OK,
      data: {
        items: result.data,
        total: result.total,
      },
    };
  }

  @Get('project/:projectId')
  @RequirePermissions('phases:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all phases for a project' })
  @ApiResponse({ status: 200, description: 'Phases retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getPhasesByProject(@Param('projectId') projectId: number): Promise<SuccessResponse> {
    const phases = await this.phasesService.getPhasesByProject(projectId);

    return {
      message: 'Phases retrieved successfully',
      statusCode: HttpStatus.OK,
      data: phases,
    };
  }

  @Get(':id')
  @RequirePermissions('phases:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get phase by ID' })
  @ApiResponse({ status: 200, description: 'Phase retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Phase not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const phase = await this.phasesService.findOne(id);

    return {
      message: 'Phase retrieved successfully',
      statusCode: HttpStatus.OK,
      data: phase,
    };
  }

  @Patch(':id')
  @RequirePermissions('phases:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update phase' })
  @ApiResponse({ status: 200, description: 'Phase updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Phase not found' })
  async update(
    @Param('id') id: number,
    @Body() updatePhaseDto: UpdatePhaseDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const phase = await this.phasesService.update(id, updatePhaseDto, userId);

    return {
      message: 'Phase updated successfully',
      statusCode: HttpStatus.OK,
      data: phase,
    };
  }

  @Patch(':id/progress')
  @RequirePermissions('phases:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update phase progress based on milestones' })
  @ApiResponse({ status: 200, description: 'Phase progress updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Phase not found' })
  async updateProgress(@Param('id') id: number): Promise<SuccessResponse> {
    const phase = await this.phasesService.updatePhaseProgress(id);

    return {
      message: 'Phase progress updated successfully',
      statusCode: HttpStatus.OK,
      data: phase,
    };
  }

  @Delete(':id')
  @RequirePermissions('phases:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete phase' })
  @ApiResponse({ status: 200, description: 'Phase deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Phase not found' })
  async remove(
    @Param('id') id: number,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    await this.phasesService.remove(id, userId);

    return {
      message: 'Phase deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }
}
