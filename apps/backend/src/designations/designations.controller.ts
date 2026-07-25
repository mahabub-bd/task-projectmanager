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
import { DesignationsService } from './designations.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { QueryDesignationsDto } from './dto/query-designations.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';

@ApiTags('Designations')
@Controller('designations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Post()
  @RequirePermissions('designations:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new designation' })
  @ApiResponse({ status: 201, description: 'Designation created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(
    @Body() createDesignationDto: CreateDesignationDto,
    @CurrentUser() currentUser: any,
  ): Promise<SuccessResponse> {
    const designation = await this.designationsService.create(
      createDesignationDto,
      currentUser,
    );

    return {
      message: 'Designation created successfully',
      statusCode: HttpStatus.CREATED,
      data: designation,
    };
  }

  @Get()
  @RequirePermissions('designations:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all designations with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Designations retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(@Query() query: QueryDesignationsDto): Promise<SuccessResponse> {
    const result = await this.designationsService.findAll(query);

    return {
      message: 'Designations retrieved successfully',
      statusCode: HttpStatus.OK,
      data: {
        items: result.data,
        total: result.total,
      },
    };
  }

  @Get('list')
  @RequirePermissions('designations:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get simple designation list (id and name only)' })
  @ApiQuery({ name: 'organization_id', required: false })
  @ApiResponse({ status: 200, description: 'Designation list retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAllSimple(@Query('organization_id') organizationId?: number): Promise<SuccessResponse> {
    const designations = await this.designationsService.findAllSimple(organizationId);

    return {
      message: 'Designation list retrieved successfully',
      statusCode: HttpStatus.OK,
      data: designations,
    };
  }

  @Get(':id')
  @RequirePermissions('designations:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get designation by ID' })
  @ApiResponse({ status: 200, description: 'Designation retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Designation not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const designation = await this.designationsService.findOne(id);

    return {
      message: 'Designation retrieved successfully',
      statusCode: HttpStatus.OK,
      data: designation,
    };
  }

  @Patch(':id')
  @RequirePermissions('designations:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update designation' })
  @ApiResponse({ status: 200, description: 'Designation updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Designation not found' })
  async update(
    @Param('id') id: number,
    @Body() updateDesignationDto: UpdateDesignationDto,
  ): Promise<SuccessResponse> {
    const designation = await this.designationsService.update(id, updateDesignationDto);

    return {
      message: 'Designation updated successfully',
      statusCode: HttpStatus.OK,
      data: designation,
    };
  }

  @Delete(':id')
  @RequirePermissions('designations:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete designation' })
  @ApiResponse({ status: 200, description: 'Designation deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Designation not found' })
  async remove(@Param('id') id: number): Promise<SuccessResponse> {
    await this.designationsService.remove(id);

    return {
      message: 'Designation deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }
}
