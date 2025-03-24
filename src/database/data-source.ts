import * as dotenv from 'dotenv-flow';
dotenv.config();

import { DataSource } from 'typeorm';
import { ConfigService } from '@/config/config.service';
import { loadConfig } from '@/config/config.loader';

async function createDataSource(): Promise<DataSource> {
  const configData = await loadConfig(process.env);
  const configService = new ConfigService(configData);

  return new DataSource({
    type: 'mysql',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.database'),
    entities: [__dirname + '/entity/*.entity.{ts,js}'],
    migrations: [__dirname + '/migrations/*.{ts,js}'],
    synchronize: false,
    migrationsTableName: 'migrations_history',
  });
}

const dataSourcePromise = createDataSource();

export default dataSourcePromise;
