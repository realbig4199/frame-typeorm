import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtAuthService } from './jwt.service';

import { ConfigService } from '@/config/config.service';
import { AccessTokenStrategy } from './jwtAccess.strategy';
import { AccessTokenGuard } from './jwtAccess.guard';
import { RefreshTokenStrategy } from './jwtRefresh.strategy';
import { RefreshTokenGuard } from './jwtRefresh.guard';

@Module({
  imports: [
    PassportModule,
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({}),
    }),
  ],
  providers: [
    AccessTokenStrategy,
    AccessTokenGuard,
    RefreshTokenStrategy,
    RefreshTokenGuard,
    JwtAuthService,
  ],
  exports: [
    AccessTokenStrategy,
    AccessTokenGuard,
    RefreshTokenStrategy,
    RefreshTokenGuard,
    JwtAuthService,
  ],
})
export class JwtModule {}
