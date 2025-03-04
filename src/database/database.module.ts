import { ConfigService } from '@/config/config.service';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { UserEntity } from './entity/user.entity';
import { LoginEntity } from './entity/login.entity';
import { DataSource } from 'typeorm';

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
        entities: [UserEntity, LoginEntity],
        synchronize: false,
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: true,
        migrationsTableName: 'migrations_history',
      }),
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        return dataSource;
      },
    }),
    TypeOrmModule.forFeature([UserEntity, LoginEntity]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService, TypeOrmModule],
})
export class DatabaseModule {}
