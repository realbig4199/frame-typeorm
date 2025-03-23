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
import { PaginationDtoTx } from '@/common/dto/pagination.dto';
import { CommonRx } from '@/common/dto/common.dto';
import { GetUsersDtoRx } from './dto/getUsers.dto';
import { GetUserDtoRx } from './dto/getUser.dto';
import { UpdateUserDtoTx } from './dto/updateUser.dto';
import { SignupDtoTx } from './dto/signup.dto';
import { SigninDtoTx } from './dto/signin.dto';
import { JwtAuthService } from '../jwt/jwt.service';
import { LoginCustomRepository } from '../login/login.repository';
import { UserCustomRepository } from './user-custom.repository';
import { CustomException } from '@/common/exceptions/custom-exception';
import { ERROR_CODES } from '@/common/constants/error-codes';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class UserService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwt: JwtAuthService,
    private readonly config: ConfigService,
    private readonly cache: CacheService,
    private readonly loginCustomRepository: LoginCustomRepository,
    private readonly userCustomRepository: UserCustomRepository,
  ) {}

  /**
   * @author 김진태 <reabig4199@gmail.com>
   * @description 유저를 조회한다.
   */
  public async getUsers(query: PaginationDtoTx): Promise<GetUsersDtoRx> {
    try {
      const { startDate, endDate, page, limit, sortBy, order } = query;

      const result = await this.userCustomRepository.findWithPagination(
        page,
        limit,
        startDate,
        endDate,
        sortBy,
        order,
      );

      const userDtos = result.items.map((user) => ({
        id: user.id,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
        passid: user.login.passid,
      }));

      return {
        users: userDtos,
        totalItems: result.meta.totalItems,
      };
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
  public async getUser(id: number): Promise<GetUserDtoRx> {
    try {
      const user = await this.userCustomRepository.userRepository.findOne({
        where: { id },
        relations: ['login'],
      });

      if (!user) {
        throw new CustomException(ERROR_CODES.USER_NOT_FOUND);
      }

      return {
        id: user.id,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
        passid: user.login.passid,
      };
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
  @Transactional()
  public async updateUser(
    user: AccessTokenPayload,
    id: number,
    dto: UpdateUserDtoTx,
  ) {
    try {
      const currentUser =
        await this.userCustomRepository.userRepository.findOne({
          where: { id: user.userId },
        });

      if (!currentUser) {
        throw new CustomException(ERROR_CODES.USER_NOT_FOUND);
      }

      const userToUpdate =
        await this.userCustomRepository.userRepository.findOne({
          where: { id },
          relations: ['login'],
        });

      if (!userToUpdate) {
        throw new CustomException(ERROR_CODES.USER_NOT_FOUND);
      }

      if (currentUser.id !== userToUpdate.id) {
        throw new CustomException(ERROR_CODES.AUTH_ACCESS_DENIED);
      }

      const { password, ...updateData } = dto;

      await this.loginCustomRepository.loginRepository.update(
        userToUpdate.login.id,
        {
          password: password
            ? await brcypt.hash(password, 10)
            : userToUpdate.login.password,
        },
      );

      await this.userCustomRepository.userRepository.update(
        userToUpdate.id,
        updateData,
      );
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
  @Transactional()
  public async deleteUser(user: AccessTokenPayload, id: number) {
    try {
      const currentUser =
        await this.userCustomRepository.userRepository.findOne({
          where: { id: user.userId },
          relations: ['login'],
        });

      if (!currentUser) {
        throw new CustomException(ERROR_CODES.USER_NOT_FOUND);
      }

      const userToDelete =
        await this.userCustomRepository.userRepository.findOne({
          where: { id },
          relations: ['login'],
        });

      if (!userToDelete) {
        throw new CustomException(ERROR_CODES.USER_NOT_FOUND);
      }

      if (currentUser.id !== userToDelete.id) {
        throw new CustomException(ERROR_CODES.AUTH_ACCESS_DENIED);
      }

      await this.userCustomRepository.userRepository.softDelete(id);

      await this.loginCustomRepository.loginRepository.softDelete(
        userToDelete.login.id,
      );
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
  @Transactional()
  public async signup(dto: SignupDtoTx): Promise<JwtToken> {
    try {
      const existingUser =
        await this.loginCustomRepository.loginRepository.findOne({
          where: { passid: dto.passid },
          relations: ['user'],
        });

      if (existingUser) {
        throw new CustomException(ERROR_CODES.USER_ALREADY_EXISTS);
      }

      const hashedPassword = await brcypt.hash(dto.password, 10);

      const newLogin = await this.loginCustomRepository.loginRepository.save({
        passid: dto.passid,
        password: hashedPassword,
      });

      const newUser = await this.userCustomRepository.userRepository.save({
        name: dto.name,
        gender: dto.gender,
        phone: dto.phone,
        email: dto.email,
        login: newLogin,
      });

      const accessPayload: AccessTokenPayload = await this.jwt.generatePayload(
        newUser.id,
        TokenType.Access,
      );

      const refreshPayload: RefreshTokenPayload =
        await this.jwt.generatePayload(newUser.id, TokenType.Refresh);

      const token = await this.jwt.generateToken(accessPayload, refreshPayload);

      await this.cache.set(
        newUser.id.toString(),
        token.refreshToken,
        86400 * 1000,
      );

      return token;
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
      const login = await this.loginCustomRepository.loginRepository.findOne({
        where: { passid: dto.passid },
        relations: ['user'],
      });

      if (!login) {
        throw new CustomException(ERROR_CODES.USER_NOT_FOUND);
      }

      const isValid = await brcypt.compare(dto.password, login.password);

      if (!isValid) {
        throw new CustomException(ERROR_CODES.AUTH_INVALID_PASSWORD);
      }

      const user = await this.userCustomRepository.userRepository.findOne({
        where: { id: login.user.id },
      });

      if (!user) {
        throw new CustomException(ERROR_CODES.USER_NOT_FOUND);
      }

      const accessPayload: AccessTokenPayload = await this.jwt.generatePayload(
        user.id,
        TokenType.Access,
      );

      const refreshPayload: RefreshTokenPayload =
        await this.jwt.generatePayload(user.id, TokenType.Refresh);

      const token = await this.jwt.generateToken(accessPayload, refreshPayload);

      await this.cache.set(
        user.id.toString(),
        token.refreshToken,
        86400 * 1000,
      );

      return token;
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
