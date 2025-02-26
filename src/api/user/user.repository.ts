import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/database/entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async create(userData: Partial<UserEntity>) {
    try {
      return this.userRepository.save(userData);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async findWithPagination(
    offset: number = 0,
    limit: number = 10,
    startDate?: string,
    endDate?: string,
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const whereCondition: Record<string, any> = { deletedAt: null };

      if (startDate && endDate) {
        whereCondition.createdAt = Between(
          new Date(startDate),
          new Date(endDate),
        );
      }

      return this.userRepository.find({
        where: whereCondition,
        skip: offset,
        take: limit,
        order: { [sortBy]: order },
        relations: ['login'],
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async findByUuid(uuid: string) {
    try {
      return this.userRepository.findOne({
        where: { uuid, deletedAt: null },
        relations: ['login'],
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async update(uuid: string, updateData: Partial<UserEntity>) {
    try {
      return this.userRepository.update({ uuid }, updateData);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async softDelete(uuid: string) {
    try {
      return this.userRepository.softDelete({ uuid });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
