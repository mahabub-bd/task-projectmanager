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
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { QueryMilestonesDto } from './dto/query-milestones.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { MilestonesService } from './milestones.service';

@ApiTags('Milestones')
@Controller('milestones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) { }

  @Post()
  @RequirePermissions('milestones:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new milestone' })
  @ApiResponse({ status: 201, description: 'Milestone created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(
    @Body() createMilestoneDto: CreateMilestoneDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const milestone = await this.milestonesService.create(createMilestoneDto, userId);

    return {
      message: 'Milestone created successfully',
      statusCode: HttpStatus.CREATED,
      data: milestone,
    };
  }

  @Get()
  @RequirePermissions('milestones:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all milestones with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Milestones retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(@Query() query: QueryMilestonesDto): Promise<SuccessResponse> {
    const result = await this.milestonesService.findAll(query);

    return {
      message: 'Milestones retrieved successfully',
      statusCode: HttpStatus.OK,
      data: {
        items: result.data,
        total: result.total,
      },
    };
  }

  @Get('upcoming/:organizationId')
  @RequirePermissions('milestones:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get upcoming milestones for an organization' })
  @ApiResponse({ status: 200, description: 'Upcoming milestones retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getUpcomingMilestones(
    @Param('organizationId') organizationId: number,
  ): Promise<SuccessResponse> {
    const milestones = await this.milestonesService.getUpcomingMilestones(
      organizationId,
    );

    return {
      message: 'Upcoming milestones retrieved successfully',
      statusCode: HttpStatus.OK,
      data: milestones || [],
    };
  }

  @Get('overdue/:organizationId')
  @RequirePermissions('milestones:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get overdue milestones for an organization' })
  @ApiResponse({ status: 200, description: 'Overdue milestones retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getOverdueMilestones(
    @Param('organizationId') organizationId: number,
  ): Promise<SuccessResponse> {
    const milestones = await this.milestonesService.getOverdueMilestones(
      organizationId,
    );

    return {
      message: 'Overdue milestones retrieved successfully',
      statusCode: HttpStatus.OK,
      data: milestones || [],
    };
  }

  @Get(':id')
  @RequirePermissions('milestones:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get milestone by ID' })
  @ApiResponse({ status: 200, description: 'Milestone retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Milestone not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const milestone = await this.milestonesService.findOne(id);

    return {
      message: 'Milestone retrieved successfully',
      statusCode: HttpStatus.OK,
      data: milestone,
    };
  }

  @Patch(':id')
  @RequirePermissions('milestones:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update milestone' })
  @ApiResponse({ status: 200, description: 'Milestone updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Milestone not found' })
  async update(
    @Param('id') id: number,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const milestone = await this.milestonesService.update(id, updateMilestoneDto, userId);

    return {
      message: 'Milestone updated successfully',
      statusCode: HttpStatus.OK,
      data: milestone,
    };
  }

  @Patch(':id/progress')
  @RequirePermissions('milestones:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update milestone progress based on tasks' })
  @ApiResponse({ status: 200, description: 'Milestone progress updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Milestone not found' })
  async updateProgress(@Param('id') id: number): Promise<SuccessResponse> {
    const milestone = await this.milestonesService.updateMilestoneProgress(id);

    return {
      message: 'Milestone progress updated successfully',
      statusCode: HttpStatus.OK,
      data: milestone,
    };
  }

  @Delete(':id')
  @RequirePermissions('milestones:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete milestone' })
  @ApiResponse({ status: 200, description: 'Milestone deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Milestone not found' })
  async remove(
    @Param('id') id: number,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    await this.milestonesService.remove(id, userId);

    return {
      message: 'Milestone deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }
}
