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
    return this.userRepository.save(userData);
  }

  public async findWithPagination(
    offset: number = 0,
    limit: number = 10,
    startDate?: string,
    endDate?: string,
  ) {
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
      order: { createdAt: 'DESC' },
      relations: ['login'],
    });
  }

  public async findByUuid(uuid: string) {
    return this.userRepository.findOne({
      where: { uuid, deletedAt: null },
      relations: ['login'],
    });
  }

  public async update(uuid: string, updateData: Partial<UserEntity>) {
    return this.userRepository.update({ uuid }, updateData);
  }

  public async softDelete(uuid: string) {
    return this.userRepository.softDelete({ uuid });
  }
}
