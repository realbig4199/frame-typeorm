import { DatabaseService } from '@/database/database.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDao } from './dao/login.dao';
import { SignUpDtoTx } from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as brcypt from 'bcryptjs';
import { UserDao } from './dao/user.dao';
import { ConfigService } from '@/config/config.service';
import { CacheService } from '@/cache/cache.service';
import { JwtToken } from '@/jwt/jwt.dto';
import { AccessTokenPayload, RefreshTokenPayload } from '@/jwt/jwt.type';
import { JwtUtils } from '@/jwt/jwt.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly cache: CacheService,
  ) {}

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 생성한다. (회원가입)
   */
  public async signUp(dto: SignUpDtoTx): Promise<JwtToken> {
    try {
      return await this.databaseService.transaction(async (manager) => {
        const loginRepository = manager.getRepository(LoginDao);
        const userRepository = manager.getRepository(UserDao);

        const existingUser = await loginRepository.findOne({
          where: { passid: dto.passid },
        });

        if (existingUser) {
          throw new HttpException(
            `${dto.passid}의 유저는 이미 존재합니다.`,
            HttpStatus.CONFLICT,
          );
        }

        const hashedPassword = await brcypt.hash(dto.password, 10);

        const newLogin = await loginRepository.save({
          passid: dto.passid,
          password: hashedPassword,
        });

        const newUser = await userRepository.save({
          name: dto.name,
          login: newLogin,
        });

        const accessPayload: AccessTokenPayload = {
          sub: newUser.uuid,
          aud: this.config.get('jwt.audience'),
          iss: this.config.get('jwt.issuer'),
          jti: uuidv4(),
          userUuid: newUser.uuid,
        };

        const refreshPayload: RefreshTokenPayload = {
          sub: newUser.uuid,
          aud: this.config.get('jwt.audience'),
          iss: this.config.get('jwt.issuer'),
          jti: uuidv4(),
          userUuid: newUser.uuid,
        };

        const token = await JwtUtils.generateToken(
          this.jwt,
          this.config.get('jwt.secret'),
          this.config.get('jwt.accessExpire'),
          this.config.get('jwt.refreshExpire'),
          accessPayload,
          refreshPayload,
        );

        await this.cache.set(newUser.id.toString(), token.refreshToken);

        return token;
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        console.log(err); // 추후 수정
        throw new HttpException(
          '회원가입에 실패했습니다',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
