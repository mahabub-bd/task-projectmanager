import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { MilestoneStatus } from '../../common/enum';


export class QueryMilestonesDto extends PaginationDto {
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
    enum: MilestoneStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(MilestoneStatus, { message: 'Status must be a valid milestone status' })
  status?: MilestoneStatus;

  @ApiProperty({
    example: 'release',
    description: 'Search by name',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;
}
