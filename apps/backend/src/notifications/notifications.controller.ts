import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/interfaces/success-response.interface';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from '../entities/notification.entity';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @Request() req,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organization_id;

    return this.notificationsService.findAll(userId, organizationId, {
      unreadOnly: unreadOnly === 'true',
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const userId = req.user.id;
    const count = await this.notificationsService.getUnreadCount(userId);
    return {
      message: 'Unread count retrieved successfully',
      statusCode: HttpStatus.OK,
      data: count,
    };
  }

  @Get('preferences')
  async getPreferences(@Request() req) {
    const userId = req.user.id;
    const organizationId = req.user.organization_id;
    const preferences = await this.notificationsService.getPreferences(userId, organizationId);
    return {
      message: 'Notification preferences retrieved successfully',
      statusCode: HttpStatus.OK,
      data: preferences,
    };
  }

  @Put('preferences/:type')
  async updatePreference(@Param('type') type: string, @Body() updateData: any, @Request() req) {
    const userId = req.user.id;
    const organizationId = req.user.organization_id;
    const preference = await this.notificationsService.updatePreference(
      userId,
      organizationId,
      type,
      updateData,
    );
    return {
      message: 'Notification preference updated successfully',
      statusCode: HttpStatus.OK,
      data: preference,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    const notification = await this.notificationsService.findOne(+id, userId);
    return {
      message: 'Notification retrieved successfully',
      statusCode: HttpStatus.OK,
      data: notification,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateNotificationDto, @Request() req) {
    const userId = req.user.id;
    const organizationId = req.user.organization_id;

    const notification = await this.notificationsService.create(
      userId,
      organizationId,
      dto,
    );

    return {
      message: 'Notification created successfully',
      statusCode: HttpStatus.CREATED,
      data: notification,
    };
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    const notification = await this.notificationsService.markAsRead(+id, userId);
    return {
      message: 'Notification marked as read',
      statusCode: HttpStatus.OK,
      data: notification,
    };
  }

  @Post('mark-all-read')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@Request() req) {
    const userId = req.user.id;
    await this.notificationsService.markAllAsRead(userId);
    return {
      message: 'All notifications marked as read',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    await this.notificationsService.delete(+id, userId);
    return {
      message: 'Notification deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
