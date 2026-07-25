import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDesignationDto {
  @ApiProperty({
    example: 'Senior Engineer',
    description: 'Designation name'
  })
  @IsNotEmpty({ message: 'Designation name is required' })
  @IsString({ message: 'Designation name must be a string' })
  name: string;

  @ApiProperty({
    example: 'Senior level engineering role',
    description: 'Designation description',
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
    description: 'Department ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Department ID must be a number' })
  department_id?: number;
}
