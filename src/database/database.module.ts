import { ConfigService } from '@/config/config.service';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { UserDao } from '@/user/dao/user.dao';
import { LoginDao } from '@/user/dao/login.dao';

const ENTITIES = [UserDao, LoginDao];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ...configService.get('database'),
          entities: ENTITIES,
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature(ENTITIES),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService, TypeOrmModule],
})
export class DatabaseModule {}
