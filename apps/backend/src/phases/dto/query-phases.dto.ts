import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PhaseStatus } from '../../common/enum';


export class QueryPhasesDto extends PaginationDto {
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
    description: 'Filter by project ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Project ID must be a number' })
  project_id?: number;

  @ApiProperty({
    example: 'in_progress',
    description: 'Filter by status',
    enum: PhaseStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(PhaseStatus, { message: 'Status must be a valid phase status' })
  status?: PhaseStatus;

  @ApiProperty({
    example: 'planning',
    description: 'Search by name',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;
}
