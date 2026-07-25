import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthController } from './health.controller';
import { MonitoringController } from './monitoring.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestTrackingInterceptor } from '../interceptors/request-tracking.interceptor';
import { RequestTrackingService } from '../services/request-tracking.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule],
  controllers: [AppController, HealthController, MonitoringController],
  providers: [
    RequestTrackingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestTrackingInterceptor,
    },
  ],
  exports: [RequestTrackingService],
})
export class CommonModule {}
