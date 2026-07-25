import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../entities/tasks.enums';

export class UpdateTaskStatusDto {
  @ApiProperty({
    example: 'IN_PROGRESS',
    description: 'New task status',
    enum: TaskStatus
  })
  @IsNotEmpty({ message: 'Status is required' })
  @IsString({ message: 'Status must be a string' })
  @IsEnum(TaskStatus, { message: 'Status must be a valid task status' })
  status: TaskStatus;

  @ApiProperty({
    example: 'Started working on the implementation',
    description: 'Reason for status change',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  reason?: string;
}
