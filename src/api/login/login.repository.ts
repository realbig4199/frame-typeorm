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

  public getRepository(manager?: EntityManager) {
    return manager ? manager.getRepository(LoginEntity) : this.loginRepository;
  }
}
