import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/database/entity/user.entity';
import { CreateUserDtoTx } from './dto/createUser.dto';

@Injectable()
export class userRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 생성한다.
   */
  public async createUser(dto: CreateUserDtoTx) {
    try {
      return await this.userRepository.save(dto);
    } catch (err) {
      console.log(err); // 추후 수정
      throw new HttpException(
        '유저 생성에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
