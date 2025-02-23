import { DatabaseService } from '@/database/database.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as brcypt from 'bcryptjs';
import { ConfigService } from '@/config/config.service';
import { CacheService } from '@/cache/cache.service';
import { JwtToken } from '@/api/jwt/jwt.dto';
import { AccessTokenPayload, RefreshTokenPayload } from '@/api/jwt/jwt.type';
import { PaginationDtoTx } from '@/common/pagination.dto';
import { Between, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { CommonRx } from '@/common/common.dto';
import { State } from '@/common/state.type';
import { GetUsersDtoRx } from './dto/getUsers.dto';
import { GetUserDtoRx } from './dto/getUser.dto';
import { UpdateUserDtoTx } from './dto/updateUser.dto';
import { SignupDtoTx } from './dto/signup.dto';
import { SigninDtoTx } from './dto/signin.dto';
import { UserEntity } from '@/database/entity/user.entity';
import { LoginEntity } from '@/database/entity/login.entity';
import { JwtAuthService } from '../jwt/jwt.service';
import { userRepository } from './user.repository';

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
        const userRepository = manager.getRepository(UserEntity);

        const { startDate, endDate, offset, limit, sortBy, order } = query;

        const users = await userRepository.find({
          where: {
            createdAt: Between(new Date(startDate), new Date(endDate)),
            state: Not(State.Deleted),
          },
          skip: offset,
          take: limit,
          order: {
            [sortBy]: order,
          },
          relations: ['login'],
        });

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
   * @description 유저를 상세조회한다.
   */
  public async getUser(
    user: AccessTokenPayload,
    uuid: string,
  ): Promise<GetUserDtoRx> {
    try {
      return await this.database.transaction(async (manager) => {
        const userRepository = manager.getRepository(UserEntity);

        const user = await userRepository.findOne({
          where: { uuid, state: Not(State.Deleted) },
          relations: ['login'],
        });

        if (!user) {
          throw new HttpException(
            `${uuid}의 유저를 찾을 수 없습니다.`,
            HttpStatus.NOT_FOUND,
          );
        }

        return {
          userUuid: user.uuid,
          name: user.name,
          passid: user.login.passid,
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
   * @description 유저를 수정한다.
   */
  public async updateUser(
    user: AccessTokenPayload,
    uuid: string,
    dto: UpdateUserDtoTx,
  ): Promise<CommonRx> {
    try {
      return await this.database.transaction(async (manager) => {
        const userRepository = manager.getRepository(UserEntity);
        const loginRepository = manager.getRepository(LoginEntity);

        const user = await userRepository.findOne({
          where: { uuid, state: Not(State.Deleted) },
          relations: ['login'],
        });

        if (!user) {
          throw new HttpException(
            `${uuid}의 유저를 찾을 수 없습니다.`,
            HttpStatus.NOT_FOUND,
          );
        }

        if (dto.name) {
          await userRepository.update({ uuid }, { name: dto.name });
        }

        if (dto.passid) {
          const login = await loginRepository.findOne({
            where: { id: user.login.id },
          });

          if (!login) {
            throw new HttpException(
              `${uuid}의 로그인 정보를 찾을 수 없습니다.`,
              HttpStatus.NOT_FOUND,
            );
          }

          await loginRepository.update(
            { id: login.id },
            { passid: dto.passid },
          );
        }

        return {
          statusCode: HttpStatus.OK,
          message: '유저가 수정되었습니다.',
        };
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        console.log(err); // 추후 수정
        throw new HttpException(
          '유저 수정에 실패했습니다',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 삭제한다.
   */
  public async deleteUser(
    user: AccessTokenPayload,
    uuid: string,
  ): Promise<CommonRx> {
    try {
      return await this.database.transaction(async (manager) => {
        const userRepository = manager.getRepository(UserEntity);
        const loginRepository = manager.getRepository(LoginEntity);

        const user = await userRepository.findOne({
          where: { uuid, state: Not(State.Deleted) },
          relations: ['login'],
        });

        if (!user) {
          throw new HttpException(
            `${uuid}의 유저를 찾을 수 없습니다.`,
            HttpStatus.NOT_FOUND,
          );
        }

        await userRepository.update({ uuid }, { state: State.Deleted });
        await loginRepository.update(
          { id: user.login.id },
          { state: State.Deleted },
        );

        return {
          statusCode: HttpStatus.OK,
          message: '유저가 삭제되었습니다.',
        };
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        console.log(err); // 추후 수정
        throw new HttpException(
          '유저 삭제에 실패했습니다',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 생성한다. (회원가입)
   */
  public async signup(dto: SignupDtoTx): Promise<JwtToken> {
    try {
      return await this.database.transaction(async (manager) => {
        const loginRepository = manager.getRepository(LoginEntity);
        const userRepository = manager.getRepository(UserEntity);

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

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 로그인한다.
   */
  public async signin(dto: SigninDtoTx): Promise<CommonRx | JwtToken> {
    try {
      return await this.database.transaction(async (manager) => {
        const loginRepository = manager.getRepository(LoginEntity);
        const userRepository = manager.getRepository(UserEntity);

        const login = await loginRepository.findOne({
          where: { passid: dto.passid, state: Not(State.Deleted) },
          relations: ['user'],
        });

        if (!login) {
          throw new HttpException(
            `${dto.passid}의 유저를 찾을 수 없습니다.`,
            HttpStatus.NOT_FOUND,
          );
        }

        const isValid = await brcypt.compare(dto.password, login.password);

        if (!isValid) {
          throw new HttpException(
            '비밀번호가 일치하지 않습니다.',
            HttpStatus.UNAUTHORIZED,
          );
        }

        const user = await userRepository.findOne({
          where: { id: login.user.id, state: Not(State.Deleted) },
        });

        if (!user) {
          throw new HttpException(
            `${user.uuid}의 유저를 찾을 수 없습니다.`,
            HttpStatus.NOT_FOUND,
          );
        }

        const accessPayload: AccessTokenPayload =
          await this.jwt.generatePayload(user.uuid);

        const refreshPayload: RefreshTokenPayload =
          await this.jwt.generatePayload(user.uuid);

        const token = await this.jwt.generateToken(
          accessPayload,
          refreshPayload,
        );

        await this.cache.set(
          user.id.toString(),
          token.refreshToken,
          86400 * 1000,
        );

        return token;
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        console.log(err); // 추후 수정
        throw new HttpException(
          '로그인에 실패했습니다',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
