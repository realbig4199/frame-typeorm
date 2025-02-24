import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/database/entity/user.entity';
import { CreateDtoTx } from './dto/create.dto';
import { UpdateDtoTx } from './dto/update.dto';
import { LoginEntity } from '@/database/entity/login.entity';
import { PaginationDtoTx } from '@/common/pagination.dto';

@Injectable()
export class userRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(LoginEntity)
    private readonly loginRepository: Repository<LoginEntity>,
  ) {}

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 생성한다.
   */
  public async create(dto: CreateDtoTx) {
    try {
      const login = await this.loginRepository.save({
        passid: dto.passid,
        password: dto.hashedPassword,
      })

      return await this.userRepository.save({
        name: dto.name,
        login,
      })
    } catch (err) {
      console.log(err); // 추후 수정
      throw new HttpException(
        '유저 생성에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 조회한다.
   */
  public async getAll(dto: PaginationDtoTx) {
    try {
      const { startDate, endDate, offset, limit, sortBy, order } = dto;
      return await this.userRepository.find({
        where: {
          createdAt: Between(new Date(startDate), new Date(endDate)),
          deletedAt: null,
        },
        skip: offset,
        take: limit,
        order: {
          [sortBy]: order,
        },
        relations: ['login'],
      });
    } catch (err) {
      console.log(err); // 추후 수정
      throw new HttpException(
        '유저 조회에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 상세 조회한다.
   */
  public async get(uuid: string) {
    try {
      return await this.userRepository.findOne({
        where: { uuid, deletedAt: null },
        relations: ['login'],
      })
    } catch (err) {
      console.log(err); // 추후 수정
      throw new HttpException(
        '유저 상세 조회에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 수정한다.
   */
  public async update(uuid: string, dto: UpdateDtoTx) {
    try {
      const user = await this.userRepository.findOne({
        where: { uuid, deletedAt: null },
        relations: ['login'],
      });
  
      if (!user) {
        throw new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }
  
      if (dto.name) {
        await this.userRepository.update({ uuid }, { name: dto.name });
      }
  
      if (dto.passid || dto.hashedPassword) {
        if (!user.login) {
          throw new HttpException('로그인 정보를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
        }
  
        await this.loginRepository.update(
          { id: user.login.id },
          {
            passid: dto.passid || user.login.passid,
            password: dto.hashedPassword || user.login.password,
          }
        );
      }
        return await this.userRepository.findOne({
        where: { uuid },
        relations: ['login'],
      });
    } catch (err) {
      console.log(err); // 추후 수정
      throw new HttpException(
        '유저 수정에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 삭제한다.
   */
  public async delete(uuid: string) {
    try {
      const user = await this.userRepository.findOne({ where: { uuid, deletedAt: null }, relations: ['login'] });
  
      if (!user) {
        throw new HttpException(
          `${uuid}의 유저를 찾을 수 없습니다.`,
          HttpStatus.NOT_FOUND,
        );
      }
  
      await this.userRepository.softDelete({ uuid });
  
      if (user.login) {
        await this.loginRepository.softDelete({ id: user.login.id });
      }
    } catch (err) {
      console.log(err); // 추후 수정
      throw new HttpException(
        '유저 삭제에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
