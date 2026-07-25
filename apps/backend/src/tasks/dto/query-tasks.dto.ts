import { IsOptional, IsEnum, IsString, IsDateString, IsNumber, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../../entities/tasks.enums';
import { Type } from 'class-transformer';

export class QueryTasksDto {
  @ApiProperty({
    example: 1,
    description: 'Filter by project ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Project ID must be a number' })
  project_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Filter by department ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Department ID must be a number' })
  department_id?: number;

  @ApiProperty({
    example: 2,
    description: 'Filter by assigned user ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Assigned user ID must be a number' })
  assigned_to?: number;

  @ApiProperty({
    example: 'IN_PROGRESS',
    description: 'Filter by task status',
    enum: TaskStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be a valid task status' })
  status?: TaskStatus;

  @ApiProperty({
    example: 'HIGH',
    description: 'Filter by task priority',
    enum: TaskPriority,
    required: false
  })
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority must be a valid task priority' })
  priority?: TaskPriority;

  @ApiProperty({
    example: '2026-03-01T00:00:00.000Z',
    description: 'Filter tasks due after this date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  due_date_from?: string;

  @ApiProperty({
    example: '2026-03-31T23:59:59.999Z',
    description: 'Filter tasks due before this date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  due_date_to?: string;

  @ApiProperty({
    example: 'authentication',
    description: 'Search term to filter tasks by title or description',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Search term must be a string' })
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

  @ApiProperty({
    example: 'created_at',
    description: 'Field to sort by',
    required: false,
    default: 'created_at'
  })
  @IsOptional()
  @IsString({ message: 'Sort by must be a string' })
  sort_by?: string = 'created_at';

  @ApiProperty({
    example: 'DESC',
    description: 'Sort order (ascending or descending)',
    required: false,
    default: 'DESC',
    enum: ['ASC', 'DESC']
  })
  @IsOptional()
  @IsString({ message: 'Sort order must be a string' })
  @IsIn(['ASC', 'DESC'], { message: 'Sort order must be ASC or DESC' })
  sort_order?: 'ASC' | 'DESC' = 'DESC';
}
