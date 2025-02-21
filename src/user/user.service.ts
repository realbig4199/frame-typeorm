import { DatabaseService } from '@/database/database.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDao } from './dao/login.dao';
import { GetUsersDtoRx, SignUpDtoTx } from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as brcypt from 'bcryptjs';
import { UserDao } from './dao/user.dao';
import { ConfigService } from '@/config/config.service';
import { CacheService } from '@/cache/cache.service';
import { JwtToken } from '@/jwt/jwt.dto';
import { AccessTokenPayload, RefreshTokenPayload } from '@/jwt/jwt.type';
import { PaginationDtoTx } from '@/common/pagination.dto';
import { JwtAuthService } from '@/jwt/jwt.service';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwt: JwtAuthService,
    private readonly config: ConfigService,
    private readonly cache: CacheService,
  ) {}

  /**
   * @author 김진태 <reabig4199@gmail.com>
   * @description 유저를 조회한다.
   */
  public async getUsers(
    user: AccessTokenPayload,
    query: PaginationDtoTx,
  ): Promise<GetUsersDtoRx> {
    try {
      return await this.database.transaction(async (manager) => {
        const loginRepository = manager.getRepository(LoginDao);
        const userRepository = manager.getRepository(UserDao);

        const { startDate, endDate, offset, limit, sortBy, order } = query;

        const users = await userRepository.find({
          where: [
            { createdAt: MoreThanOrEqual(new Date(startDate)) },
            { createdAt: LessThanOrEqual(new Date(endDate)) },
          ],
          skip: offset,
          take: limit,
          order: {
            [sortBy]: order,
          },
          relations: ['login'],
        });

        console.log(users);

        const userDtos = users.map((user) => ({
          userUuid: user.uuid,
          name: user.name,
          passid: user.login.passid,
        }));

        return {
          users: userDtos,
        };
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        console.log(err); // 추후 수정
        throw new HttpException(
          '유저 조회에 실패했습니다',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 생성한다. (회원가입)
   */
  public async signUp(dto: SignUpDtoTx): Promise<JwtToken> {
    try {
      return await this.database.transaction(async (manager) => {
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

        const accessPayload: AccessTokenPayload =
          await this.jwt.generatePayload(newUser.uuid);

        const refreshPayload: RefreshTokenPayload =
          await this.jwt.generatePayload(newUser.uuid);

        const token = await this.jwt.generateToken(
          accessPayload,
          refreshPayload,
        );

        await this.cache.set(
          newUser.id.toString(),
          token.refreshToken,
          86400 * 1000,
        );

        return token;

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
