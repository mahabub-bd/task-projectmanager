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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/interfaces/success-response.interface';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @RequirePermissions('create:organizations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, description: 'Organization created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 409, description: 'Organization already exists' })
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<SuccessResponse> {
    const organization = await this.organizationsService.create(
      createOrganizationDto,
    );

    return {
      message: 'Organization created successfully',
      statusCode: HttpStatus.CREATED,
      data: organization,
    };
  }

  @Get()
  @RequirePermissions('read:organizations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(): Promise<SuccessResponse> {
    const organizations = await this.organizationsService.findAll();

    return {
      message: 'Organizations retrieved successfully',
      statusCode: HttpStatus.OK,
      data: organizations || [],
    };
  }

  @Get(':id')
  @RequirePermissions('read:organizations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({ status: 200, description: 'Organization retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const organization = await this.organizationsService.findOne(id);

    return {
      message: 'Organization retrieved successfully',
      statusCode: HttpStatus.OK,
      data: organization,
    };
  }

  @Patch(':id')
  @RequirePermissions('update:organizations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update organization' })
  @ApiResponse({ status: 200, description: 'Organization updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async update(
    @Param('id') id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<SuccessResponse> {
    const organization = await this.organizationsService.update(
      id,
      updateOrganizationDto,
    );

    return {
      message: 'Organization updated successfully',
      statusCode: HttpStatus.OK,
      data: organization,
    };
  }

  @Delete(':id')
  @RequirePermissions('delete:organizations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete organization' })
  @ApiResponse({ status: 200, description: 'Organization deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async remove(@Param('id') id: number): Promise<SuccessResponse> {
    await this.organizationsService.remove(id);

    return {
      message: 'Organization deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }

  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @RequirePermissions('update:organizations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload organization logo' })
  @ApiResponse({ status: 200, description: 'Logo uploaded successfully' })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async uploadLogo(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SuccessResponse> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const organization = await this.organizationsService.uploadLogo(
      id,
      file,
    );

    return {
      message: 'Logo uploaded successfully',
      statusCode: HttpStatus.OK,
      data: organization,
    };
  }

  @Delete(':id/logo')
  @RequirePermissions('update:organizations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete organization logo' })
  @ApiResponse({ status: 200, description: 'Logo deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async removeLogo(@Param('id') id: number): Promise<SuccessResponse> {
    const organization = await this.organizationsService.removeLogo(id);

    return {
      message: 'Logo deleted successfully',
      statusCode: HttpStatus.OK,
      data: organization,
    };
  }

  @Post(':id/dark-logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @RequirePermissions('update:organizations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload organization dark logo' })
  @ApiResponse({ status: 200, description: 'Dark logo uploaded successfully' })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async uploadDarkLogo(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SuccessResponse> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const organization = await this.organizationsService.uploadDarkLogo(
      id,
      file,
    );

    return {
      message: 'Dark logo uploaded successfully',
      statusCode: HttpStatus.OK,
      data: organization,
    };
  }

  @Delete(':id/dark-logo')
  @RequirePermissions('update:organizations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete organization dark logo' })
  @ApiResponse({ status: 200, description: 'Dark logo deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async removeDarkLogo(@Param('id') id: number): Promise<SuccessResponse> {
    const organization = await this.organizationsService.removeDarkLogo(id);

    return {
      message: 'Dark logo deleted successfully',
      statusCode: HttpStatus.OK,
      data: organization,
    };
  }

  @Post(':id/light-logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @RequirePermissions('update:organizations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload organization light logo' })
  @ApiResponse({ status: 200, description: 'Light logo uploaded successfully' })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async uploadLightLogo(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SuccessResponse> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const organization = await this.organizationsService.uploadLightLogo(
      id,
      file,
    );

    return {
      message: 'Light logo uploaded successfully',
      statusCode: HttpStatus.OK,
      data: organization,
    };
  }

  @Delete(':id/light-logo')
  @RequirePermissions('update:organizations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete organization light logo' })
  @ApiResponse({ status: 200, description: 'Light logo deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async removeLightLogo(@Param('id') id: number): Promise<SuccessResponse> {
    const organization = await this.organizationsService.removeLightLogo(id);

    return {
      message: 'Light logo deleted successfully',
      statusCode: HttpStatus.OK,
      data: organization,
    };
  }
}
