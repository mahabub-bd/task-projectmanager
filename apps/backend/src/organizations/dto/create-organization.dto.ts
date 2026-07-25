import { IsEmail, IsNotEmpty, IsString, IsOptional, IsUrl, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({
    example: 'Acme Corporation',
    description: 'Organization name'
  })
  @IsNotEmpty({ message: 'Organization name is required' })
  @IsString({ message: 'Organization name must be a string' })
  name: string;

  @ApiProperty({
    example: 'A leading technology company specializing in software development',
    description: 'Organization description',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    example: 'acme-corp',
    description: 'Unique organization slug (min 3 characters)',
    minLength: 3
  })
  @IsNotEmpty({ message: 'Organization slug is required' })
  @IsString({ message: 'Slug must be a string' })
  @MinLength(3, { message: 'Slug must be at least 3 characters' })
  slug: string;

  @ApiProperty({
    example: 'https://www.acme.com',
    description: 'Organization website',
    required: false
  })
  @IsOptional()
  @IsUrl({}, { message: 'Website must be a valid URL' })
  @MaxLength(255, { message: 'Website must not exceed 255 characters' })
  website?: string;

  @ApiProperty({
    example: '123 Main St, New York, NY 10001',
    description: 'Organization address',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @ApiProperty({
    example: '+1 234 567 8900',
    description: 'Organization phone number',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @MaxLength(20, { message: 'Phone must not exceed 20 characters' })
  phone?: string;

  @ApiProperty({
    example: 'contact@acme.com',
    description: 'Organization email',
    required: false
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email?: string;
}
