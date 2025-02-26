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
    try {
      return this.loginRepository.save(loginData);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async update(id: number, updateData: Partial<LoginEntity>) {
    try {
      return this.loginRepository.update({ id }, updateData);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async softDelete(id: number) {
    try {
      return this.loginRepository.softDelete({ id });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
