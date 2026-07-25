import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDivisionDto {
  @ApiProperty({
    example: 'North America Operations',
    description: 'Division name'
  })
  @IsNotEmpty({ message: 'Division name is required' })
  @IsString({ message: 'Division name must be a string' })
  name: string;

  @ApiProperty({
    example: 'All operations and departments in North America',
    description: 'Division description',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'Organization ID'
  })
  @IsNotEmpty({ message: 'Organization ID is required' })
  @IsNumber({}, { message: 'Organization ID must be a number' })
  organization_id: number;

  @ApiProperty({
    example: 2,
    description: 'Parent division ID for nested divisions',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Parent division ID must be a number' })
  parent_division_id?: number;
}
