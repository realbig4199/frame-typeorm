import { DataSource } from 'typeorm';
import { ConfigService } from '@/config/config.service';
import { UserEntity } from './entity/user.entity';
import { LoginEntity } from './entity/login.entity';
import { loadConfig } from '@/config/config.loader';
import { BoardEntity } from '@/database/entity/board.entity';

async function createDataSource(): Promise<DataSource> {
  const configData = await loadConfig(process.env);
  const configService = new ConfigService(configData);

  return new DataSource({
    type: 'mysql',
    host: configService.get<string>('database.host') || 'localhost',
    port: configService.get<number>('database.port') || 3306,
    username: configService.get<string>('database.username') || 'recipot',
    password: configService.get<string>('database.password') || 'recipot1!11',
    database: configService.get<string>('database.database') || 'recipot',
    entities: [UserEntity, LoginEntity, BoardEntity],
    migrations: [__dirname + '/migrations/*.ts'],
    synchronize: false,
    migrationsTableName: 'migrations_history',
  });
}

const dataSourcePromise = createDataSource();

export default dataSourcePromise;
