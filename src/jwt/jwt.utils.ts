import { JwtService } from '@nestjs/jwt';

import { JwtToken } from '@/jwt/jwt.dto';

export class JwtUtils {
  public static extractBearer(bearerToken: string): string {
    const [, token] = bearerToken.split(' ');
    return token;
  }

  public static async generateToken(
    jwt: JwtService,
    secret: string,
    accessExpire: number,
    refreshExpire: number,
    accessPayload: any,
    refreshPayload: any,
  ): Promise<JwtToken> {
    const accessToken = await jwt.signAsync(accessPayload, {
      algorithm: 'HS256',
      secret: secret,
      expiresIn: accessExpire,
    });
    const refreshToken = await jwt.signAsync(refreshPayload, {
      algorithm: 'HS256',
      secret: secret,
      expiresIn: refreshExpire,
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessExpire: accessExpire,
      refreshExpire: refreshExpire,
    };
  }
}
