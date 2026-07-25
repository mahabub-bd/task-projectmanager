import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/interfaces/success-response.interface';
import { AttachmentsService } from './attachments.service';

@ApiTags('Attachments')
@Controller('tasks/:taskId/attachments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @RequirePermissions('attachment:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload an attachment to S3' })
  @ApiResponse({ status: 201, description: 'Attachment uploaded successfully' })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async upload(
    @Param('taskId') taskId: number,
    @UploadedFile() file: Express.Multer.File,
    @Query('description') description?: string,
    @CurrentUser('id') userId?: number,
  ): Promise<SuccessResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const attachment = await this.attachmentsService.uploadFile(
      taskId,
      file,
      userId!,
      description,
    );

    return {
      message: 'Attachment uploaded successfully',
      statusCode: HttpStatus.CREATED,
      data: attachment,
    };
  }

  @Get()
  @RequirePermissions('attachment:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all attachments for a task' })
  @ApiResponse({ status: 200, description: 'Attachments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(@Param('taskId') taskId: number): Promise<SuccessResponse> {
    const attachments = await this.attachmentsService.findByTask(taskId);

    return {
      message: 'Attachments retrieved successfully',
      statusCode: HttpStatus.OK,
      data: attachments || [],
    };
  }

  @Get(':id')
  @RequirePermissions('attachment:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get attachment by ID' })
  @ApiResponse({ status: 200, description: 'Attachment retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const attachment = await this.attachmentsService.findOne(id);

    return {
      message: 'Attachment retrieved successfully',
      statusCode: HttpStatus.OK,
      data: attachment,
    };
  }

  @Get(':id/download-url')
  @RequirePermissions('attachment:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get signed URL for downloading an attachment' })
  @ApiQuery({ name: 'expiresIn', required: false, description: 'URL expiration time in seconds (default: 3600)' })
  @ApiResponse({ status: 200, description: 'Download URL generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async getDownloadUrl(
    @Param('id') id: number,
    @Query('expiresIn') expiresIn?: string,
  ): Promise<SuccessResponse> {
    const expires = expiresIn ? parseInt(expiresIn) : 3600;
    const url = await this.attachmentsService.getSignedUrl(id, expires);

    return {
      message: 'Download URL generated successfully',
      statusCode: HttpStatus.OK,
      data: { url, expires_in: expires },
    };
  }

  @Get(':id/public-url')
  @RequirePermissions('attachment:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get public URL for an attachment (if bucket is public)' })
  @ApiResponse({ status: 200, description: 'Public URL retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async getPublicUrl(@Param('id') id: number): Promise<SuccessResponse> {
    const url = await this.attachmentsService.getPublicUrl(id);

    return {
      message: 'Public URL retrieved successfully',
      statusCode: HttpStatus.OK,
      data: { url },
    };
  }

  @Delete(':id')
  @RequirePermissions('attachment:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete attachment from S3' })
  @ApiResponse({ status: 200, description: 'Attachment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async remove(
    @Param('id') id: number,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    await this.attachmentsService.remove(id, userId);

    return {
      message: 'Attachment deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }
}
