import { ConfigService } from '@/config/config.service';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { UserEntity } from './entity/user.entity';
import { LoginEntity } from './entity/login.entity';
import { DataSource } from 'typeorm';
import { BoardEntity } from '@/database/entity/board.entity';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [UserEntity, LoginEntity, BoardEntity],
        synchronize: false,
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: true,
        migrationsTableName: 'migrations_history',
        // logging: true, // 트랜잭션 확인용
      }),
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        return addTransactionalDataSource(dataSource);
      },
    }),
    TypeOrmModule.forFeature([UserEntity, LoginEntity, BoardEntity]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService, TypeOrmModule],
})
export class DatabaseModule {}
