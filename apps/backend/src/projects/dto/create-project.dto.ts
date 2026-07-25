import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProjectPriority, ProjectStatus } from '../../entities/project.entity';
import { IsOptionalDateString } from '../../common/validators';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Website Redesign',
    description: 'Project name'
  })
  @IsNotEmpty({ message: 'Project name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    example: 'Complete website redesign with new branding',
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
    example: 'medium',
    description: 'Project priority',
    enum: ProjectPriority,
    required: false
  })
  @IsOptional()
  @IsEnum(ProjectPriority, { message: 'Priority must be a valid project priority' })
  priority?: ProjectPriority;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Project start date (ISO 8601 format)',
    required: false
  })
  @IsOptionalDateString()
  start_date?: string;

  @ApiProperty({
    example: '2026-06-30T23:59:59.999Z',
    description: 'Project end date (ISO 8601 format)',
    required: false
  })
  @IsOptionalDateString()
  end_date?: string;

  @ApiProperty({
    example: '2026-06-30T23:59:59.999Z',
    description: 'Project due date (ISO 8601 format)',
    required: false
  })
  @IsOptionalDateString()
  due_date?: string;

  @ApiProperty({
    example: 0,
    description: 'Project progress percentage (0-100)',
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'Progress must be an integer' })
  progress?: number;

  @ApiProperty({
    example: '#3b82f6',
    description: 'Project color in hex format',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Color must be a string' })
  color?: string;

  @ApiProperty({
    example: 50000,
    description: 'Project budget',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Budget must be a number' })
  budget?: number;

  @ApiProperty({
    example: 1,
    description: 'Organization ID'
  })
  @IsNotEmpty({ message: 'Organization ID is required' })
  @IsNumber({}, { message: 'Organization ID must be a number' })
  organization_id: number;

  @ApiProperty({
    example: 1,
    description: 'Project Manager user ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Manager ID must be a number' })
  manager_id?: number;
}
