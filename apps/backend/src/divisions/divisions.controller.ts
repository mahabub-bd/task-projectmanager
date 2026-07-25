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
import { DivisionsService } from './divisions.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { QueryDivisionsDto } from './dto/query-divisions.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';

@ApiTags('Divisions')
@Controller('divisions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class DivisionsController {
  constructor(private readonly divisionsService: DivisionsService) {}

  @Post()
  @RequirePermissions('divisions:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new division' })
  @ApiResponse({ status: 201, description: 'Division created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(
    @Body() createDivisionDto: CreateDivisionDto,
    @CurrentUser() currentUser: any,
  ): Promise<SuccessResponse> {
    const division = await this.divisionsService.create(
      createDivisionDto,
      currentUser,
    );

    return {
      message: 'Division created successfully',
      statusCode: HttpStatus.CREATED,
      data: division,
    };
  }

  @Get()
  @RequirePermissions('divisions:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all divisions with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Divisions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(@Query() query: QueryDivisionsDto): Promise<SuccessResponse> {
    const result = await this.divisionsService.findAll(query);

    return {
      message: 'Divisions retrieved successfully',
      statusCode: HttpStatus.OK,
      data: {
        items: result.data,
        total: result.total,
      },
    };
  }

  @Get('list')
  @RequirePermissions('divisions:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get simple division list (id and name only)' })
  @ApiQuery({ name: 'organization_id', required: false })
  @ApiResponse({ status: 200, description: 'Division list retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAllSimple(@Query('organization_id') organizationId?: number): Promise<SuccessResponse> {
    const divisions = await this.divisionsService.findAllSimple(organizationId);

    return {
      message: 'Division list retrieved successfully',
      statusCode: HttpStatus.OK,
      data: divisions,
    };
  }

  @Get('tree')
  @RequirePermissions('divisions:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get division tree' })
  @ApiQuery({ name: 'organizationId', required: true })
  @ApiResponse({ status: 200, description: 'Division tree retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getTree(@Query('organizationId') organizationId: number): Promise<SuccessResponse> {
    const tree = await this.divisionsService.getTree(organizationId);

    return {
      message: 'Division tree retrieved successfully',
      statusCode: HttpStatus.OK,
      data: tree || [],
    };
  }

  @Get(':id')
  @RequirePermissions('divisions:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get division by ID' })
  @ApiResponse({ status: 200, description: 'Division retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Division not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const division = await this.divisionsService.findOne(id);

    return {
      message: 'Division retrieved successfully',
      statusCode: HttpStatus.OK,
      data: division,
    };
  }

  @Get(':id/departments')
  @RequirePermissions('divisions:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get departments for a division' })
  @ApiResponse({ status: 200, description: 'Division departments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Division not found' })
  async getDepartments(@Param('id') id: number): Promise<SuccessResponse> {
    const departments = await this.divisionsService.getDepartments(id);

    return {
      message: 'Division departments retrieved successfully',
      statusCode: HttpStatus.OK,
      data: departments || [],
    };
  }

  @Patch(':id')
  @RequirePermissions('divisions:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update division' })
  @ApiResponse({ status: 200, description: 'Division updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Division not found' })
  async update(
    @Param('id') id: number,
    @Body() updateDivisionDto: UpdateDivisionDto,
  ): Promise<SuccessResponse> {
    const division = await this.divisionsService.update(id, updateDivisionDto);

    return {
      message: 'Division updated successfully',
      statusCode: HttpStatus.OK,
      data: division,
    };
  }

  @Delete(':id')
  @RequirePermissions('divisions:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete division' })
  @ApiResponse({ status: 200, description: 'Division deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Division not found' })
  async remove(@Param('id') id: number): Promise<SuccessResponse> {
    await this.divisionsService.remove(id);

    return {
      message: 'Division deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }
}
