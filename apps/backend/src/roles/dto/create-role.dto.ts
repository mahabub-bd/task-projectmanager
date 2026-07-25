import { IsNotEmpty, IsString, IsArray, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Administrator',
    description: 'Role name'
  })
  @IsNotEmpty({ message: 'Role name is required' })
  @IsString({ message: 'Role name must be a string' })
  name: string;

  @ApiProperty({
    example: 'Full system administrator with all permissions',
    description: 'Role description',
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
    example: [1, 2, 3],
    description: 'Array of permission IDs to assign to this role',
    required: false,
    type: [Number]
  })
  @IsOptional()
  @IsArray({ message: 'Permission IDs must be an array' })
  @IsNumber({}, { each: true, message: 'Each permission ID must be a number' })
  permission_ids?: number[];
}
