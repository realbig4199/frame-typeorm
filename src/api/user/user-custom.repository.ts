import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/database/entity/user.entity';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CustomException } from '@/common/exceptions/custom-exception';
import { ERROR_CODES } from '@/common/constants/error-codes';

@Injectable()
export class UserCustomRepository {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
  ) {}
  public async findWithPagination(
    page: number = 0,
    limit: number = 10,
    startDate?: string,
    endDate?: string,
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ): Promise<Pagination<UserEntity>> {
    try {
      const where: Record<string, any> = {};

      if (startDate && endDate) {
        where.createdAt = Between(new Date(startDate), new Date(endDate));
      }

      const result = await paginate<UserEntity>(
        this.userRepository,
        { page, limit },
        {
          where,
          order: { [sortBy]: order },
          relations: ['login'],
        },
      );

      if (!result) {
        throw new CustomException(ERROR_CODES.USER_NOT_FOUND);
      }

      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
