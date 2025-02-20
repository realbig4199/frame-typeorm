import { Request } from 'express';

export class TokenPayloadBase {
  public iss: string;
  public sub: string;
  public aud: string;
  // public exp: number;
  // public nbf: number;
  // public iat: number;
  public jti: string;
}

export class AccessTokenPayload extends TokenPayloadBase {
  userUuid: string;
}

export class RefreshTokenPayload extends TokenPayloadBase {
  userUuid: string;
}

export interface RequestWithUser extends Request {
  user: AccessTokenPayload;
}
