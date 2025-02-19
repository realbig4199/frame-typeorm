import { join } from 'path';

import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@/config/config.module';
import { UserModule } from './user/user.module';
import { CacheModule } from './cache/cache.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
