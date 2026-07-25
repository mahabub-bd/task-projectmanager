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
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @RequirePermissions('tags:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: 201, description: 'Tag created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(
    @Body() createTagDto: CreateTagDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const tag = await this.tagsService.create(createTagDto, userId);

    return {
      message: 'Tag created successfully',
      statusCode: HttpStatus.CREATED,
      data: tag,
    };
  }

  @Get()
  @RequirePermissions('tags:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'Tags retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(
    @Query('organization_id') organization_id?: number,
    @Query('search') search?: string,
  ): Promise<SuccessResponse> {
    const tags = await this.tagsService.findAll(organization_id, search);

    return {
      message: 'Tags retrieved successfully',
      statusCode: HttpStatus.OK,
      data: tags || [],
    };
  }

  @Get(':id')
  @RequirePermissions('tags:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const tag = await this.tagsService.findOne(id);

    return {
      message: 'Tag retrieved successfully',
      statusCode: HttpStatus.OK,
      data: tag,
    };
  }

  @Patch(':id')
  @RequirePermissions('tags:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update tag' })
  @ApiResponse({ status: 200, description: 'Tag updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async update(
    @Param('id') id: number,
    @Body() updateTagDto: UpdateTagDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const tag = await this.tagsService.update(id, updateTagDto, userId);

    return {
      message: 'Tag updated successfully',
      statusCode: HttpStatus.OK,
      data: tag,
    };
  }

  @Delete(':id')
  @RequirePermissions('tags:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete tag' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async remove(
    @Param('id') id: number,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    await this.tagsService.remove(id, userId);

    return {
      message: 'Tag deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }
}
