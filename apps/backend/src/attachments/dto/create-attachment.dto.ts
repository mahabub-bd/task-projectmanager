import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttachmentDto {
  @ApiProperty({
    example: 1,
    description: 'Task ID to attach the file to'
  })
  @IsNotEmpty({ message: 'Task ID is required' })
  @IsNumber({}, { message: 'Task ID must be a number' })
  task_id: number;

  @ApiProperty({
    example: 'project-specifications.pdf',
    description: 'Name of the attached file'
  })
  @IsNotEmpty({ message: 'File name is required' })
  @IsString({ message: 'File name must be a string' })
  file_name: string;

  @ApiProperty({
    example: 'https://example.com/uploads/project-specifications.pdf',
    description: 'URL where the file can be accessed'
  })
  @IsNotEmpty({ message: 'File URL is required' })
  @IsString({ message: 'File URL must be a string' })
  file_url: string;

  @ApiProperty({
    example: 2048576,
    description: 'File size in bytes'
  })
  @IsNotEmpty({ message: 'File size is required' })
  @IsNumber({}, { message: 'File size must be a number' })
  file_size: number;

  @ApiProperty({
    example: 'DOCUMENT',
    description: 'Type of file (e.g., DOCUMENT, IMAGE, VIDEO)'
  })
  @IsNotEmpty({ message: 'File type is required' })
  @IsString({ message: 'File type must be a string' })
  file_type: string;

  @ApiProperty({
    example: 'Detailed project specifications and requirements',
    description: 'Description of the attachment',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    example: 'application/pdf',
    description: 'MIME type of the file',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'MIME type must be a string' })
  mime_type?: string;
}
