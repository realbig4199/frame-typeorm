import { DatabaseService } from '@/database/database.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDao } from './dao/login.dao';
import { SignUpDtoTx } from './dto/user.dto';
import { CommonRx } from '@/common/common.dto';
import * as brcypt from 'bcryptjs';
import { UserDao } from './dao/user.dao';
import { ConfigService } from '@/config/config.service';
import { CacheService } from '@/cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly config: ConfigService,
    private readonly cache: CacheService,
  ) {}

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 생성한다. (회원가입)
   */
  public async signUp(dto: SignUpDtoTx): Promise<CommonRx> {
    try {
      return await this.databaseService.transaction(async (manager) => {
        const loginRepository = manager.getRepository(LoginDao);
        const userRepository = manager.getRepository(UserDao);

        const existingUser = await loginRepository.findOne({
          where: { passid: dto.passid },
        });

        if (existingUser) {
          return {
            statusCode: HttpStatus.CONFLICT,
            message: `${dto.passid}의 유저는 이미 존재합니다.`,
          };
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

        await userRepository.save(newUser);

        return {
          statusCode: HttpStatus.CREATED,
          message: '회원가입 성공',
        };
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
