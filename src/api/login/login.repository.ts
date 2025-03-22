import { LoginEntity } from '@/database/entity/login.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class LoginCustomRepository {
  constructor(
    @InjectRepository(LoginEntity)
    public readonly loginRepository: Repository<LoginEntity>,
  ) {}

  // public async create(
  //   loginData: Partial<LoginEntity>,
  //   manager?: EntityManager,
  // ) {
  //   try {
  //     const repository = manager
  //       ? manager.getRepository(LoginEntity)
  //       : this.loginRepository;

  //     return await repository.save(loginData);
  //   } catch (err) {
  //     console.log(err);
  //     throw err;
  //   }
  // }

  // public async findByPassid(passid: string, manager?: EntityManager) {
  //   try {
  //     const repository = manager
  //       ? manager.getRepository(LoginEntity)
  //       : this.loginRepository;

  //     return await repository.findOne({
  //       where: { passid, deletedAt: null },
  //       relations: ['user'],
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     throw err;
  //   }
  // }

  // public async update(
  //   id: number,
  //   updateData: Partial<LoginEntity>,
  //   manager?: EntityManager,
  // ) {
  //   try {
  //     const repository = manager
  //       ? manager.getRepository(LoginEntity)
  //       : this.loginRepository;

  //     return await repository.update({ id }, updateData);
  //   } catch (err) {
  //     console.log(err);
  //     throw err;
  //   }
  // }

  // public async softDelete(id: number, manager?: EntityManager) {
  //   try {
  //     const repository = manager
  //       ? manager.getRepository(LoginEntity)
  //       : this.loginRepository;

  //     return await repository.softDelete({ id });
  //   } catch (err) {
  //     console.log(err);
  //     throw err;
  //   }
  // }
}
