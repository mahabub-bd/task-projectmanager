import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { MilestoneStatus } from '../../common/enum';


export class UpdateMilestoneDto {
  @ApiProperty({
    example: 'Q1 Release v2',
    description: 'Milestone name',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiProperty({
    example: 'Updated first quarter release',
    description: 'Milestone description',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    example: 'in_progress',
    description: 'Milestone status',
    enum: MilestoneStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(MilestoneStatus, { message: 'Status must be a valid milestone status' })
  status?: MilestoneStatus;

  @ApiProperty({
    example: '2026-01-15T00:00:00.000Z',
    description: 'Milestone start date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({
    example: '2026-04-15T23:59:59.999Z',
    description: 'Milestone end date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({
    example: '2026-04-15T23:59:59.999Z',
    description: 'Milestone due date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiProperty({
    example: 50,
    description: 'Milestone progress percentage (0-100)',
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'Progress must be an integer' })
  progress?: number;

  @ApiProperty({
    example: '#10b981',
    description: 'Milestone color in hex format',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Color must be a string' })
  color?: string;

  @ApiProperty({
    example: 1,
    description: 'Project ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Project ID must be a number' })
  project_id?: number;
}
