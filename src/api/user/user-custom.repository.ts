import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/database/entity/user.entity';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

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
    const where: Record<string, any> = {};

    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    return await paginate<UserEntity>(
      this.userRepository,
      { page, limit },
      {
        where,
        order: { [sortBy]: order },
        relations: ['login'],
      },
    );
  }
}
