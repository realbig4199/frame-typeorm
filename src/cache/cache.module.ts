import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';

import { CacheService } from '@/cache/cache.service';
import { ConfigService } from '@/config/config.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisConfig = config.get('redis');

        return {
          store: await redisStore({
            url: redisConfig.url,
            username: redisConfig.options.username,
            password: redisConfig.options.password,
            ttl: redisConfig.options.ttl,
          }),
        };
      },
    }),
  ],
  // providers: [
  //   CacheService,
  //   {
  //     provide: CACHE_MANAGER,
  //     useFactory: async (configService: ConfigService) => {
  //       const redisConfig = configService.get('redis');
  //       return await redisStore({
  //         url: redisConfig.url,
  //         username: redisConfig.options.username,
  //         password: redisConfig.options.password,
  //         ttl: redisConfig.options.ttl,
  //       });
  //     },
  //     inject: [ConfigService],
  //   },
  // ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
