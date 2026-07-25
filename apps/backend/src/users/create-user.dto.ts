import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsEnum } from 'class-validator';
import { UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address'
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name'
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    example: 'EMP001',
    description: 'Employee ID',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Employee ID must be a string' })
  employee_id?: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password'
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({
    example: 2,
    description: 'Department ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Department ID must be a number' })
  department_id?: number;

  @ApiProperty({
    example: '123 Main St, City, Country',
    description: 'User physical address',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @ApiProperty({
    example: 1,
    description: 'Designation ID',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Designation ID must be a number' })
  designation_id?: number;

  @ApiProperty({
    example: 'active',
    description: 'User status',
    enum: UserStatus,
    default: UserStatus.PENDING,
    required: false
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status must be a valid user status' })
  status?: UserStatus;

  @ApiProperty({
    example: 30,
    description: 'User age',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(0, { message: 'Age must be a positive number' })
  age?: number;
}
