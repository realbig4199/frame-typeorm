import { DatabaseService } from '@/database/database.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as brcypt from 'bcryptjs';
import { ConfigService } from '@/config/config.service';
import { CacheService } from '@/cache/cache.service';
import { JwtToken } from '@/api/jwt/jwt.dto';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenType,
} from '@/api/jwt/jwt.type';
import { PaginationDtoTx } from '@/common/pagination.dto';
import { CommonRx } from '@/common/common.dto';
import { GetUsersDtoRx } from './dto/getUsers.dto';
import { GetUserDtoRx } from './dto/getUser.dto';
import { UpdateUserDtoTx } from './dto/updateUser.dto';
import { SignupDtoTx } from './dto/signup.dto';
import { SigninDtoTx } from './dto/signin.dto';
import { JwtAuthService } from '../jwt/jwt.service';
import { LoginRepository } from '../login/login.repository';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwt: JwtAuthService,
    private readonly config: ConfigService,
    private readonly cache: CacheService,
    private readonly loginRepository: LoginRepository,
    private readonly userRepository: UserRepository,
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
        const { startDate, endDate, offset, limit, sortBy, order } = query;

        const users = await this.userRepository.findWithPagination(
          offset,
          limit,
          startDate,
          endDate,
          sortBy,
          order,
          manager,
        );

        const userDtos = users.map((user) => ({
          userUuid: user.uuid,
          // name: user.name, // 엔터티 구조 변경에 따른 수정
          gender: user.gender,
          phone: user.phone,
          email: user.email,
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
        const user = await this.userRepository.findByUuid(uuid, manager);

        if (!user) {
          throw new HttpException(
            `${uuid}의 유저를 찾을 수 없습니다.`,
            HttpStatus.NOT_FOUND,
          );
        }

        return {
          userUuid: user.uuid,
          // name: user.name,
          gender: user.gender,
          phone: user.phone,
          email: user.email,
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
        const currentUser = await this.userRepository.findByUuid(
          user.userUuid,
          manager,
        );

        if (!currentUser) {
          throw new HttpException(
            `${user.userUuid}의 유저를 찾을 수 없습니다.`,
            HttpStatus.NOT_FOUND,
          );
        }

        const userToUpdate = await this.userRepository.findByUuid(
          uuid,
          manager,
        );

        if (!userToUpdate) {
          throw new HttpException(
            `${uuid}의 유저를 찾을 수 없습니다.`,
            HttpStatus.NOT_FOUND,
          );
        }

        if (currentUser.uuid !== userToUpdate.uuid) {
          throw new HttpException(
            '수정 권한이 없습니다.',
            HttpStatus.UNAUTHORIZED,
          );
        }

        // 엔터티 구조 변경에 따른 수정
        // if (dto.name) {
        //   await this.userRepository.update(uuid, { name: dto.name }, manager);
        // }

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
        const user = await this.userRepository.findByUuid(uuid, manager);

        if (!user) {
          throw new HttpException(
            `${uuid}의 유저를 찾을 수 없습니다.`,
            HttpStatus.NOT_FOUND,
          );
        }

        await this.userRepository.softDelete(uuid, manager);

        await this.loginRepository.softDelete(user.login.id, manager);

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
        const existingUser = await this.loginRepository.findByPassid(
          dto.passid,
          manager,
        );

        if (existingUser) {
          throw new HttpException(
            `${dto.passid}의 유저는 이미 존재합니다.`,
            HttpStatus.CONFLICT,
          );
        }

        const hashedPassword = await brcypt.hash(dto.password, 10);

        const newLogin = await this.loginRepository.create(
          {
            passid: dto.passid,
            password: hashedPassword,
          },
          manager,
        );

        const newUser = await this.userRepository.create(
          {
            // name: dto.name, // 엔터티 구조 변경에 따른 수정
            gender: dto.gender,
            phone: dto.phone,
            email: dto.email,
            login: newLogin,
          },
          manager,
        );

        const accessPayload: AccessTokenPayload =
          await this.jwt.generatePayload(newUser.uuid, TokenType.Access);

        const refreshPayload: RefreshTokenPayload =
          await this.jwt.generatePayload(newUser.uuid, TokenType.Refresh);

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
        const login = await this.loginRepository.findByPassid(
          dto.passid,
          manager,
        );

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

        const user = await this.userRepository.findByUuid(
          login.user.uuid,
          manager,
        );

        if (!user) {
          throw new HttpException(
            `${user.uuid}의 유저를 찾을 수 없습니다.`,
            HttpStatus.NOT_FOUND,
          );
        }

        const accessPayload: AccessTokenPayload =
          await this.jwt.generatePayload(user.uuid, TokenType.Access);

        const refreshPayload: RefreshTokenPayload =
          await this.jwt.generatePayload(user.uuid, TokenType.Refresh);

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
