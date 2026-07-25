import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus, Put, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SuccessResponse } from '../common/interfaces/success-response.interface';
import { NotificationPreferenceService } from '../email/notification-preference.service';
import { NotificationType } from '../entities/notification-preference.entity';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class NotificationController {
  constructor(private notificationPreferenceService: NotificationPreferenceService) {}

  @Get('preferences')
  @ApiOperation({ summary: 'Get user notification preferences' })
  @ApiResponse({ status: 200, description: 'Returns user preferences' })
  async getPreferences(@CurrentUser('id') userId: number): Promise<SuccessResponse> {
    const preferences = await this.notificationPreferenceService.getUserPreferences(userId);
    return {
      message: 'Preferences retrieved successfully',
      statusCode: HttpStatus.OK,
      data: preferences,
    };
  }

  @Put('preferences/:type')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update notification preference' })
  @ApiResponse({ status: 200, description: 'Preference updated' })
  async updatePreference(
    @CurrentUser('id') userId: number,
    @Param('type') type: NotificationType,
    @Body() body: { email_enabled?: boolean; in_app_enabled?: boolean; reminder_hours?: number },
  ): Promise<SuccessResponse> {
    const preference = await this.notificationPreferenceService.updatePreference(
      userId,
      type,
      body.email_enabled ?? true,
      body.in_app_enabled ?? true,
      body.reminder_hours,
    );
    return {
      message: 'Preference updated successfully',
      statusCode: HttpStatus.OK,
      data: preference,
    };
  }

  @Post('preferences/test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send test notification' })
  @ApiResponse({ status: 200, description: 'Test notification sent' })
  async sendTestNotification(@CurrentUser('id') userId: number): Promise<SuccessResponse> {
    // Send a test email to verify configuration
    return {
      message: 'Test notification functionality - implement with actual email service',
      statusCode: HttpStatus.OK,
      data: { success: true },
    };
  }
}
