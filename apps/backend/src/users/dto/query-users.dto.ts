import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export class QueryUsersDto {
  @ApiProperty({
    example: 1,
    description: 'Filter by department ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Department ID must be a number' })
  department_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Filter by designation ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Designation ID must be a number' })
  designation_id?: number;

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
    description: 'Filter by user status',
    enum: UserStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status must be a valid user status' })
  status?: UserStatus;

  @ApiProperty({
    example: 'john',
    description: 'Search by name or email',
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
