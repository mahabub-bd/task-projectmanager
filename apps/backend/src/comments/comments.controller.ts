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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @RequirePermissions('comment:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(
    @Param('taskId') taskId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const comment = await this.commentsService.create(
      { ...createCommentDto, task_id: taskId },
      userId,
    );

    return {
      message: 'Comment created successfully',
      statusCode: HttpStatus.CREATED,
      data: comment,
    };
  }

  @Get()
  @RequirePermissions('comment:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all comments for a task' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(@Param('taskId') taskId: number): Promise<SuccessResponse> {
    const comments = await this.commentsService.findByTask(taskId);

    return {
      message: 'Comments retrieved successfully',
      statusCode: HttpStatus.OK,
      data: comments || [],
    };
  }

  @Get(':id')
  @RequirePermissions('comment:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: number): Promise<SuccessResponse> {
    const comment = await this.commentsService.findOne(id);

    return {
      message: 'Comment retrieved successfully',
      statusCode: HttpStatus.OK,
      data: comment,
    };
  }

  @Patch(':id')
  @RequirePermissions('comment:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const comment = await this.commentsService.update(id, updateCommentDto, userId);

    return {
      message: 'Comment updated successfully',
      statusCode: HttpStatus.OK,
      data: comment,
    };
  }

  @Delete(':id')
  @RequirePermissions('comment:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async remove(
    @Param('id') id: number,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    await this.commentsService.remove(id, userId);

    return {
      message: 'Comment deleted successfully',
      statusCode: HttpStatus.OK,
      data: { id },
    };
  }

  @Post(':id/like')
  @RequirePermissions('comment:create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Like a comment' })
  @ApiResponse({ status: 200, description: 'Comment liked successfully' })
  @ApiResponse({ status: 400, description: 'Already liked' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async likeComment(
    @Param('id') id: number,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const comment = await this.commentsService.likeComment(id, userId);

    return {
      message: 'Comment liked successfully',
      statusCode: HttpStatus.OK,
      data: comment,
    };
  }

  @Delete(':id/like')
  @RequirePermissions('comment:create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unlike a comment' })
  @ApiResponse({ status: 200, description: 'Comment unliked successfully' })
  @ApiResponse({ status: 400, description: 'Not liked' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async unlikeComment(
    @Param('id') id: number,
    @CurrentUser('id') userId: number,
  ): Promise<SuccessResponse> {
    const comment = await this.commentsService.unlikeComment(id, userId);

    return {
      message: 'Comment unliked successfully',
      statusCode: HttpStatus.OK,
      data: comment,
    };
  }

  @Get(':id/likes')
  @RequirePermissions('comment:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get comment likes' })
  @ApiResponse({ status: 200, description: 'Comment likes retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async getCommentLikes(@Param('id') id: number): Promise<SuccessResponse> {
    const likes = await this.commentsService.getCommentLikes(id);

    return {
      message: 'Comment likes retrieved successfully',
      statusCode: HttpStatus.OK,
      data: likes,
    };
  }
}
