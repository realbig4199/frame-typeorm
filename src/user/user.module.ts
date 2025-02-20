import { Module } from '@nestjs/common';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { DatabaseModule } from '@/database/database.module';
import { JwtModule } from '@/jwt/jwt.module';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
