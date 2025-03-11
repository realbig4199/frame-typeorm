import { join } from 'path';

import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@/config/config.module';
import { CacheModule } from './cache/cache.module';
import { UserModule } from './api/user/user.module';
import { LoginModule } from './api/login/login.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
// import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { BoardModule } from '@/api/board/board.module';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRootAsync({
      isGlobal: true,
      envFilePath: process.env.production
        ? join(__dirname, '../.env')
        : undefined,
    }),
    UserModule,
    CacheModule,
    LoginModule,
    BoardModule,
  ],
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
