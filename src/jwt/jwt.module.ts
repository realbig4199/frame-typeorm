import { Module } from '@nestjs/common';
import {
  JwtModule as NestJwtModule,
  JwtService as NestJwtService,
} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigService } from '@/config/config.service';
import { JwtGuard } from '@/jwt/jwt.guard';
import { JwtStrategy } from '@/jwt/jwt.stratgey';

/**
 * @author 이현수 <keyclops93483@keyclops.com>
 * @description JWT 모듈
 */
@Module({
  imports: [
    PassportModule,
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({}),
    }),
  ],
  providers: [JwtStrategy, JwtGuard, NestJwtService],
  exports: [JwtStrategy, JwtGuard, NestJwtService],
})
export class JwtModule {}
