import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum DivisionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class QueryDivisionsDto {
  @ApiProperty({
    example: 1,
    description: 'Filter by organization ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Organization ID must be a number' })
  organization_id?: number;

  @ApiProperty({
    example: 'active',
    description: 'Filter by division status',
    enum: DivisionStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(DivisionStatus, { message: 'Status must be a valid division status' })
  status?: DivisionStatus;

  @ApiProperty({
    example: 'operations',
    description: 'Search by name or description',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;

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
    example: 20,
    description: 'Number of items per page',
    required: false,
    default: 20
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  limit?: number = 20;
}
