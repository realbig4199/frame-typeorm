import { Module } from '@nestjs/common';
import { LoginRepository } from './login.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [LoginRepository],
  exports: [LoginRepository],
})
export class LoginModule {}
