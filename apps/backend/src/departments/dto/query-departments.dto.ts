import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum DepartmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class QueryDepartmentsDto {
  @ApiProperty({
    example: 1,
    description: 'Filter by organization ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Organization ID must be a number' })
  organization_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Filter by division ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Division ID must be a number' })
  division_id?: number;

  @ApiProperty({
    example: 'active',
    description: 'Filter by department status',
    enum: DepartmentStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(DepartmentStatus, { message: 'Status must be a valid department status' })
  status?: DepartmentStatus;

  @ApiProperty({
    example: 'engineering',
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
