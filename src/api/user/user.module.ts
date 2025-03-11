import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { JwtModule } from '@/api/jwt/jwt.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoginRepository } from '../login/login.repository';
import { UserCustomRepository } from './user-custom.repository';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [UserController],
  providers: [UserService, LoginRepository, UserCustomRepository],
})
export class UserModule {}
