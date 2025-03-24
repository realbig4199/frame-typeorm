import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@/config/config.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { UserModule } from '@/api/user/user.module';
import { LoginModule } from '@/api/login/login.module';
import { BoardModule } from '@/api/board/board.module';
import { CacheModule } from '@/cache/cache.module';
import { DatabaseModule } from '@/database/database.module';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';

export const FeatureModules = [
  UserModule,
  LoginModule,
  BoardModule,
  CacheModule,
  DatabaseModule,
];

@Module({
  imports: [ConfigModule.forRootAsync({ isGlobal: true }), ...FeatureModules],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
