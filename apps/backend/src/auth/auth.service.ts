import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserStatus } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from '../email/email.service';

export interface JwtPayload {
  sub: number;
  email: string;
  organization_id: number;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const organization = await this.organizationRepository.findOne({
      where: { id: registerDto.organization_id },
    });

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    const password_hash = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password_hash,
      phone_number: registerDto.phone_number,
      status: registerDto.status || UserStatus.PENDING,
      organization_id: registerDto.organization_id,
      department_id: registerDto.department_id,
    });

    const savedUser = await this.userRepository.save(user);

    // Assign default role
    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'Employee', organization_id: registerDto.organization_id },
    });

    if (defaultRole) {
      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'user_roles')
        .of(savedUser)
        .add({
          user_id: savedUser.id,
          role_id: defaultRole.id,
        });
    }

    // Create audit log
    await this.auditLogRepository.save({
      user_id: savedUser.id,
      action: AuditAction.CREATE,
      entity_type: 'user',
      entity_id: savedUser.id,
      new_values: { email: savedUser.email, name: savedUser.name },
      organization_id: savedUser.organization_id,
    });

    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(savedUser.email, savedUser.name);
    } catch (error) {
      // Log error but don't fail registration
      console.error('Failed to send welcome email:', error);
    }

    return savedUser;
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<Tokens & { user: any }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['organization', 'department', 'user_roles', 'user_roles.role', 'user_roles.role.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User account is not active');
    }

    // Update last login
    await this.userRepository.update(user.id, {
      last_login_at: new Date(),
    });

    // Create audit log
    await this.auditLogRepository.save({
      user_id: user.id,
      action: AuditAction.LOGIN,
      entity_type: 'user',
      entity_id: user.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      organization_id: user.organization_id,
    });

    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    return {
      ...tokens,
      user: this.serializeUserForFrontend(user),
    };
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!tokenEntity || tokenEntity.is_revoked || tokenEntity.expires_at < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findOne({
      where: { id: tokenEntity.user.id },
      relations: ['organization'],
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Revoke old token
    await this.refreshTokenRepository.update(tokenEntity.id, {
      is_revoked: true,
      revoked_at: new Date(),
    });

    // Generate new tokens
    return this.generateTokens(user);
  }

  async logout(userId: number, refreshToken: string): Promise<void> {
    // Try to revoke the specific refresh token, but don't fail if it's already revoked
    await this.refreshTokenRepository.update(
      { token: refreshToken, user_id: userId },
      { is_revoked: true, revoked_at: new Date() },
    ).catch(() => {
      // Token might already be revoked or not exist - that's okay
    });

    // Optionally revoke all tokens for this user for security
    await this.refreshTokenRepository.update(
      { user_id: userId },
      { is_revoked: true, revoked_at: new Date() },
    ).catch(() => {
      // Ignore errors
    });

    // Create audit log
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      await this.auditLogRepository.save({
        user_id: userId,
        action: AuditAction.LOGOUT,
        entity_type: 'user',
        entity_id: userId,
        organization_id: user.organization_id,
      });
    }
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['organization', 'department', 'user_roles', 'user_roles.role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User account is not active');
    }

    return user;
  }

  private async generateTokens(
    user: User,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      organization_id: user.organization_id,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = uuidv4();
    const expires_in = this.configService.get<number>('JWT_EXPIRATION', 3600); // 1 hour default
    const refresh_expires_in = this.configService.get<number>('JWT_REFRESH_EXPIRATION', 604800); // 7 days default

    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setSeconds(refreshTokenExpiresAt.getSeconds() + refresh_expires_in);

    await this.refreshTokenRepository.save({
      user_id: user.id,
      token: refresh_token,
      expires_at: refreshTokenExpiresAt,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    return {
      access_token,
      refresh_token,
      expires_in,
    };
  }

  /**
   * Serialize user object for frontend consumption
   * Transforms user_roles into roles array with permissions
   */
  serializeUserForFrontend(user: User): any {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar_url,
      organization_id: user.organization_id,
      organization_name: user.organization?.name,
      organization_logo: user.organization?.logo_url,
      organization_dark_logo: user.organization?.dark_logo_url,
      organization_light_logo: user.organization?.light_logo_url,
      department_id: user.department_id,
      department_name: user.department?.name,
      roles: user.user_roles?.map((ur) => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
        permissions: ur.role.permissions || [],
      })) || [],
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = uuidv4();

    // Store token in user record (you may want a separate table for this in production)
    await this.userRepository.update(user.id, {
      reset_token: resetToken,
      reset_token_expires_at: new Date(Date.now() + 3600000), // 1 hour
    });

    // Send password reset email
    try {
      await this.emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new BadRequestException('Failed to send password reset email');
    }

    // Create audit log
    await this.auditLogRepository.save({
      user_id: user.id,
      action: AuditAction.PASSWORD_RESET,
      entity_type: 'user',
      entity_id: user.id,
      description: 'Password reset requested',
      organization_id: user.organization_id,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { reset_token: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (user.reset_token_expires_at && user.reset_token_expires_at < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    const password_hash = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update(user.id, {
      password_hash,
      reset_token: null,
      reset_token_expires_at: null,
    });

    // Create audit log
    await this.auditLogRepository.save({
      user_id: user.id,
      action: AuditAction.PASSWORD_CHANGE,
      entity_type: 'user',
      entity_id: user.id,
      description: 'Password reset successfully',
      organization_id: user.organization_id,
    });
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    const password_hash = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update(userId, { password_hash });

    // Create audit log
    await this.auditLogRepository.save({
      user_id: userId,
      action: AuditAction.PASSWORD_CHANGE,
      entity_type: 'user',
      entity_id: userId,
      organization_id: user.organization_id,
    });
  }

  async updateProfile(userId: number, updateData: { name?: string; email?: string; bio?: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['organization', 'department', 'user_roles', 'user_roles.role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if email is being changed and if it's already taken
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateData.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    // Store old values for audit log
    const oldValues = {
      name: user.name,
      email: user.email,
      bio: user.bio,
    };

    // Update user
    await this.userRepository.update(userId, {
      name: updateData.name || user.name,
      email: updateData.email || user.email,
      bio: updateData.bio !== undefined ? updateData.bio : user.bio,
    });

    // Fetch updated user with relations
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['organization', 'department', 'user_roles', 'user_roles.role'],
    });

    // Create audit log
    await this.auditLogRepository.save({
      user_id: userId,
      action: AuditAction.UPDATE,
      entity_type: 'user',
      entity_id: userId,
      old_values: oldValues,
      new_values: {
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
      },
      organization_id: user.organization_id,
    });

    return updatedUser;
  }
}
