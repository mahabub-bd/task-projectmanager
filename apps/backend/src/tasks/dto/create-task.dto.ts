import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../../entities/tasks.enums';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implement user authentication',
    description: 'Task title'
  })
  @IsNotEmpty({ message: 'Task title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({
    example: 'Implement JWT-based authentication with refresh token support',
    description: 'Detailed task description'
  })
  @IsNotEmpty({ message: 'Task description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({
    example: 'TODO',
    description: 'Task status',
    enum: TaskStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be a valid task status' })
  status?: TaskStatus;

  @ApiProperty({
    example: 'MEDIUM',
    description: 'Task priority',
    enum: TaskPriority,
    required: false
  })
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority must be a valid task priority' })
  priority?: TaskPriority;

  @ApiProperty({
    example: 1,
    description: 'Department ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Department ID must be a number' })
  department_id?: number;

  @ApiProperty({
    example: 2,
    description: 'User ID of the person assigned to this task',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Assigned user ID must be a number' })
  assigned_to?: number;

  @ApiProperty({
    example: '2026-03-15T23:59:59.999Z',
    description: 'Task due date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiProperty({
    example: '2026-03-10T09:00:00.000Z',
    description: 'Task start date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({
    example: 8,
    description: 'Estimated hours to complete the task',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Estimated hours must be a number' })
  estimated_hours?: number;

  @ApiProperty({
    example: 'MVP Release',
    description: 'Task milestone or phase',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Milestone must be a string' })
  milestone?: string;

  @ApiProperty({
    example: 45,
    description: 'Task progress percentage (0-100)',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Progress must be a number' })
  progress?: number;

  @ApiProperty({
    example: 3,
    description: 'Parent task ID for subtasks',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Parent task ID must be a number' })
  parent_task_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Project ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Project ID must be a number' })
  project_id?: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of tag IDs',
    required: false,
    type: [Number]
  })
  @IsOptional()
  @IsArray({ message: 'Tag IDs must be an array' })
  @IsNumber({}, { each: true, message: 'Each tag ID must be a number' })
  tag_ids?: number[];
}
