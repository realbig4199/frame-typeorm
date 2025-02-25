import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { JwtModule } from '@/api/jwt/jwt.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
