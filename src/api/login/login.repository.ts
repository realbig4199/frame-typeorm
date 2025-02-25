import { LoginEntity } from '@/database/entity/login.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LoginRepository {
  constructor(
    @InjectRepository(LoginEntity)
    private readonly loginRepository: Repository<LoginEntity>,
  ) {}

  public async create(loginData: Partial<LoginEntity>) {
    return this.loginRepository.save(loginData);
  }

  public async update(id: number, updateData: Partial<LoginEntity>) {
    return this.loginRepository.update({ id }, updateData);
  }

  public async softDelete(id: number) {
    return this.loginRepository.softDelete({ id });
  }
}
