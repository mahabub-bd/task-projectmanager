import { IsNotEmpty, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionsDto {
  @ApiProperty({
    example: [1, 2, 3, 4],
    description: 'Array of permission IDs to assign to the role',
    type: [Number]
  })
  @IsNotEmpty({ message: 'Permission IDs are required' })
  @IsArray({ message: 'Permission IDs must be an array' })
  @IsNumber({}, { each: true, message: 'Each permission ID must be a number' })
  permission_ids: number[];
}
