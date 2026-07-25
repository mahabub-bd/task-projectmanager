import { IsOptional, IsEnum, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../../entities/project.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryProjectsDto extends PaginationDto {
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
    description: 'Filter by manager ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Manager ID must be a number' })
  manager_id?: number;

  @ApiProperty({
    example: 'active',
    description: 'Filter by status',
    enum: ProjectStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(ProjectStatus, { message: 'Status must be a valid project status' })
  status?: ProjectStatus;

  @ApiProperty({
    example: 'website',
    description: 'Search by name',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;
}
