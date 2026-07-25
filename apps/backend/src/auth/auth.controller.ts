import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/interfaces/success-response.interface';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<SuccessResponse> {
    const user = await this.authService.register(registerDto);

    return {
      message: 'User registered successfully',
      statusCode: HttpStatus.CREATED,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        organization_id: user.organization_id,
      },
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Account disabled or banned' })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: any,
  ): Promise<SuccessResponse> {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.login(loginDto, ipAddress, userAgent);

    return {
      message: 'Login successful',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<SuccessResponse> {
    const tokens = await this.authService.refreshToken(refreshTokenDto.refresh_token);

    return {
      message: 'Token refreshed successfully',
      statusCode: HttpStatus.OK,
      data: tokens,
    };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @Body() body: { user_id: number; refresh_token: string },
  ): Promise<SuccessResponse> {
    await this.authService.logout(body.user_id, body.refresh_token);

    return {
      message: 'Logout successful',
      statusCode: HttpStatus.OK,
      data: { success: true },
    };
  }

  @Get('me')
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'Returns current user info' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@CurrentUser() user: any): Promise<SuccessResponse> {
    const serializedUser = this.authService.serializeUserForFrontend(user);
    return {
      message: 'User retrieved successfully',
      statusCode: HttpStatus.OK,
      data: serializedUser,
    };
  }

  @Patch('profile')
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @CurrentUser('id') userId: number,
    @Body() updateData: { name?: string; email?: string; bio?: string },
  ): Promise<SuccessResponse> {
    const user = await this.authService.updateProfile(userId, updateData);

    return {
      message: 'Profile updated successfully',
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<SuccessResponse> {
    await this.authService.forgotPassword(forgotPasswordDto.email);

    return {
      message: 'Password reset email sent successfully',
      statusCode: HttpStatus.OK,
      data: { email: forgotPasswordDto.email },
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<SuccessResponse> {
    await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.new_password);

    return {
      message: 'Password reset successfully',
      statusCode: HttpStatus.OK,
      data: { success: true },
    };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password successfully changed' })
  @ApiResponse({ status: 401, description: 'Invalid current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @CurrentUser('id') userId: number,
    @Body() body: { old_password: string; new_password: string },
  ): Promise<SuccessResponse> {
    await this.authService.changePassword(userId, body.old_password, body.new_password);

    return {
      message: 'Password changed successfully',
      statusCode: HttpStatus.OK,
      data: { success: true },
    };
  }
}
