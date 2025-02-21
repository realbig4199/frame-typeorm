import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtAuthService } from './jwt.service';

import { ConfigService } from '@/config/config.service';
import { JwtGuard } from '@/jwt/jwt.guard';
import { JwtStrategy } from '@/jwt/jwt.stratgey';

@Module({
  imports: [
    PassportModule,
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({}),
    }),
  ],
  providers: [JwtStrategy, JwtGuard, JwtAuthService],
  exports: [JwtStrategy, JwtGuard, JwtAuthService],
})
export class JwtModule {}
