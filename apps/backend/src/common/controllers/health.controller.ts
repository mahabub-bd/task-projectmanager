import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Public } from '../decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Public()
  @Get()
  async health() {
    const pool = this.dataSource.driver as any;
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: this.dataSource.isInitialized,
        total: pool.pool?.totalCount || 0,
        idle: pool.pool?.idleCount || 0,
        active: (pool.pool?.totalCount || 0) - (pool.pool?.idleCount || 0),
        max: pool.pool?.max || 20,
      },
    };
  }

  @Public()
  @Get('connections')
  async getConnections() {
    const pool = this.dataSource.driver as any;
    return {
      database: {
        total: pool.pool?.totalCount || 0,
        idle: pool.pool?.idleCount || 0,
        active: (pool.pool?.totalCount || 0) - (pool.pool?.idleCount || 0),
        max: pool.pool?.max || 20,
        utilization: `${(((pool.pool?.totalCount || 0) - (pool.pool?.idleCount || 0)) / (pool.pool?.max || 1) * 100).toFixed(1)}%`,
      },
    };
  }
}
