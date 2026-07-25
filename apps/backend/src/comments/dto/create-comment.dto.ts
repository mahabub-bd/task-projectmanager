import { IsNotEmpty, IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
    description: 'Task ID to attach the comment to',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Task ID must be a number' })
  task_id?: number;

  @ApiProperty({
    example: 'This looks great! I have a few suggestions for improvement.',
    description: 'Comment content'
  })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  content: string;

  @ApiProperty({
    example: 2,
    description: 'Parent comment ID for threaded replies',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Parent comment ID must be a number' })
  parent_comment_id?: number;

  @ApiProperty({
    example: [1, 2],
    description: 'Array of user IDs to mention in the comment',
    required: false,
    type: [Number]
  })
  @IsOptional()
  @IsArray({ message: 'Mentions must be an array' })
  @IsNumber({}, { each: true, message: 'Each mention must be a number' })
  mentions?: number[];
}
