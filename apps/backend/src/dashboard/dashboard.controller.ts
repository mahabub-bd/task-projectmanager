import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/interfaces/success-response.interface';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('token')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Aggregate counts for the dashboard (single fast endpoint)' })
  async getStats(): Promise<SuccessResponse> {
    const data = await this.dashboardService.getStats();
    return { message: 'Dashboard stats fetched', statusCode: 200, data };
  }
}
