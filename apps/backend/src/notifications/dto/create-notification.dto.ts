import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject, IsNumber, IsDateString } from 'class-validator';
import { NotificationType, NotificationPriority } from '../../entities/common.enums';

export class CreateNotificationDto {
  @IsNumber()
  @IsOptional()
  user_id?: number;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @IsString()
  @IsOptional()
  related_entity_type?: string;

  @IsNumber()
  @IsOptional()
  related_entity_id?: number;

  @IsString()
  @IsOptional()
  action_url?: string;

  @IsDateString()
  @IsOptional()
  expires_at?: string;
}
