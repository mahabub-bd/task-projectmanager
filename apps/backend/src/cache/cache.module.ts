import { CacheModule } from '@nestjs/cache-manager';
import { Global, Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { cacheConfig } from '../config/cache.config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get('REDIS_HOST', '144.79.249.74');
        const redisPort = configService.get<number>('REDIS_PORT', 6379);
        const redisUsername = configService.get('REDIS_USERNAME', 'default');
        const redisPassword = configService.get('REDIS_PASSWORD', 'Palash@980');

        return {
          store: redisStore,
          host: redisHost,
          port: redisPort,
          password: redisPassword,
          username: redisUsername,
          ttl: cacheConfig.ttl,
          max: cacheConfig.max,
          isCacheable: cacheConfig.isCacheable,
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule implements OnModuleInit {
  private readonly logger = new Logger(AppCacheModule.name);

  onModuleInit() {
    this.logger.log('✅ Redis cache connected successfully');
  }
}
