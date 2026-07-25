import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { PhaseStatus } from '../../common/enum';


export class UpdatePhaseDto {
  @ApiProperty({
    example: 'Planning Phase v2',
    description: 'Phase name',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiProperty({
    example: 'Updated planning and requirements gathering',
    description: 'Phase description',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    example: 'in_progress',
    description: 'Phase status',
    enum: PhaseStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(PhaseStatus, { message: 'Status must be a valid phase status' })
  status?: PhaseStatus;

  @ApiProperty({
    example: 50,
    description: 'Phase progress percentage (0-100)',
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'Progress must be an integer' })
  progress?: number;

  @ApiProperty({
    example: '#10b981',
    description: 'Phase color in hex format',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Color must be a string' })
  color?: string;

  @ApiProperty({
    example: 2,
    description: 'Order of the phase within the project',
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'Order must be an integer' })
  order?: number;

  @ApiProperty({
    example: '2026-01-15T00:00:00.000Z',
    description: 'Phase start date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({
    example: '2026-04-15T23:59:59.999Z',
    description: 'Phase end date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({
    example: '2026-04-15T23:59:59.999Z',
    description: 'Phase due date (ISO 8601 format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  due_date?: string;
}
