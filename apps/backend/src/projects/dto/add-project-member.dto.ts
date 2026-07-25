import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProjectMemberRole } from '../../entities/project-member.entity';

export class AddProjectMemberDto {
  @ApiProperty({
    example: 1,
    description: 'User ID'
  })
  @IsOptional()
  @IsInt({ message: 'User ID must be an integer' })
  user_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Department ID'
  })
  @IsOptional()
  @IsInt({ message: 'Department ID must be an integer' })
  department_id?: number;

  @ApiProperty({
    example: 'member',
    description: 'Member role',
    enum: ProjectMemberRole
  })
  @IsEnum(ProjectMemberRole, { message: 'Role must be a valid project member role' })
  role: ProjectMemberRole;

  @ApiProperty({
    example: 'Design team member',
    description: 'Notes about the member',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
