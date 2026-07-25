import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'create:tasks',
    description: 'Permission name (format: action:resource)'
  })
  @IsNotEmpty({ message: 'Permission name is required' })
  @IsString({ message: 'Permission name must be a string' })
  name: string;

  @ApiProperty({
    example: 'Allows user to create new tasks',
    description: 'Detailed description of what this permission grants'
  })
  @IsNotEmpty({ message: 'Permission description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({
    example: 'tasks',
    description: 'Resource this permission applies to (e.g., tasks, users, roles)'
  })
  @IsNotEmpty({ message: 'Resource is required' })
  @IsString({ message: 'Resource must be a string' })
  resource: string;

  @ApiProperty({
    example: 'create',
    description: 'Action granted (e.g., create, read, update, delete)'
  })
  @IsNotEmpty({ message: 'Action is required' })
  @IsString({ message: 'Action must be a string' })
  action: string;
}
