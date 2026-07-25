import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({
    example: 'Engineering',
    description: 'Department name'
  })
  @IsNotEmpty({ message: 'Department name is required' })
  @IsString({ message: 'Department name must be a string' })
  name: string;

  @ApiProperty({
    example: 'Software development and engineering team',
    description: 'Department description',
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
    example: 1,
    description: 'Division ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Division ID must be a number' })
  division_id?: number;
}
