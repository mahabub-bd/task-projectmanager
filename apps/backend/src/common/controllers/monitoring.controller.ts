import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { RequestTrackingService } from '../services/request-tracking.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly trackingService: RequestTrackingService) {}

  @Public()
  @Get('stats')
  getStats() {
    return this.trackingService.getStats();
  }
}
