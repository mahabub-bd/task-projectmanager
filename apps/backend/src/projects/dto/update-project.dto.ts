import { IsString, IsOptional, IsDateString, IsEnum, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectPriority, ProjectStatus } from '../../entities/project.entity';

export class UpdateProjectDto {
  @ApiProperty({
    example: 'Website Redesign v2',
    description: 'Project name',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiProperty({
    example: 'Updated website redesign with new branding',
    description: 'Project description',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    example: 'active',
    description: 'Project status',
    enum: ProjectStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(ProjectStatus, { message: 'Status must be a valid project status' })
  status?: ProjectStatus;

  @ApiProperty({
    example: 'high',
    description: 'Project priority',
    enum: ProjectPriority,
    required: false
  })
  @IsOptional()
  @IsEnum(ProjectPriority, { message: 'Priority must be a valid project priority' })
  priority?: ProjectPriority;

  @ApiProperty({
    example: 'Project delayed due to resource constraints',
    description: 'Reason for status change',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Status change reason must be a string' })
  status_change_reason?: string;

  @ApiProperty({
    example: '2026-02-01T00:00:00.000Z',
    description: 'Project start date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({
    example: '2026-07-31T23:59:59.999Z',
    description: 'Project end date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({
    example: '2026-07-31T23:59:59.999Z',
    description: 'Project due date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiProperty({
    example: 50,
    description: 'Project progress percentage (0-100)',
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'Progress must be an integer' })
  progress?: number;

  @ApiProperty({
    example: '#10b981',
    description: 'Project color in hex format',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Color must be a string' })
  color?: string;

  @ApiProperty({
    example: 75000,
    description: 'Project budget',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Budget must be a number' })
  budget?: number;

  @ApiProperty({
    example: 2,
    description: 'Project Manager user ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Manager ID must be a number' })
  manager_id?: number;
}
