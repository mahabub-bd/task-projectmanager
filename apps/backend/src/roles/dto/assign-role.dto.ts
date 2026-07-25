import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({
    example: 1,
    description: 'User ID to assign the role to'
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber({}, { message: 'User ID must be a number' })
  user_id: number;

  @ApiProperty({
    example: 2,
    description: 'Role ID to assign'
  })
  @IsNotEmpty({ message: 'Role ID is required' })
  @IsNumber({}, { message: 'Role ID must be a number' })
  role_id: number;
}
