import { join } from 'path';

import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@/config/config.module';
import { CacheModule } from './cache/cache.module';
import { UserModule } from './api/user/user.module';
import { LoginModule } from './api/login/login.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
