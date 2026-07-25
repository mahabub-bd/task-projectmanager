import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRolesDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of Role IDs to assign to the user',
    type: [Number]
  })
  @IsNotEmpty({ message: 'Role IDs are required' })
  @IsArray({ message: 'Role IDs must be an array' })
  @IsNumber({}, { each: true, message: 'Each Role ID must be a number' })
  role_ids: number[];
}
