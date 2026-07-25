import { IsNotEmpty, IsArray, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTaskDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of user IDs to assign the task to',
    type: [Number]
  })
  @IsNotEmpty({ message: 'User IDs are required' })
  @IsArray({ message: 'User IDs must be an array' })
  @IsNumber({}, { each: true, message: 'Each user ID must be a number' })
  user_ids: number[];

  @ApiProperty({
    example: 'Please review the requirements before starting',
    description: 'Additional notes for the assignment',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}
