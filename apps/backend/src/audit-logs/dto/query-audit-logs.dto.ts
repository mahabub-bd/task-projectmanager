import { IsOptional, IsString, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { AuditAction } from '../../entities/audit-log.entity';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryAuditLogsDto {
  @ApiProperty({
    example: 1,
    description: 'Filter by user ID who performed the action',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'User ID must be a number' })
  user_id?: number;

  @ApiProperty({
    example: 'Task',
    description: 'Filter by entity type (e.g., Task, User, Organization)',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Entity type must be a string' })
  entity_type?: string;

  @ApiProperty({
    example: 1,
    description: 'Filter by entity ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Entity ID must be a number' })
  entity_id?: number;

  @ApiProperty({
    example: 'CREATE',
    description: 'Filter by action type',
    enum: AuditAction,
    required: false
  })
  @IsOptional()
  @IsEnum(AuditAction, { message: 'Action must be a valid audit action' })
  action?: AuditAction;

  @ApiProperty({
    example: 1,
    description: 'Filter by organization ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Organization ID must be a number' })
  organization_id?: number;

  @ApiProperty({
    example: '2026-03-01T00:00:00.000Z',
    description: 'Filter logs after this date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @ApiProperty({
    example: '2026-03-31T23:59:59.999Z',
    description: 'Filter logs before this date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  date_to?: string;

  @ApiProperty({
    example: 1,
    description: 'Page number for pagination',
    required: false,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  page?: number = 1;

  @ApiProperty({
    example: 50,
    description: 'Number of items per page',
    required: false,
    default: 50
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  limit?: number = 50;
}
