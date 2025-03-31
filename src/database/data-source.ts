import * as dotenv from 'dotenv-flow';
dotenv.config();

import { DataSource } from 'typeorm';

async function createDataSource(): Promise<DataSource> {
  return new DataSource({
    type: process.env.DB_TYPE as 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306, // 기본값 추가
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/entity/*.entity.{ts,js}'],
    migrations: [__dirname + '/migrations/*.{ts,js}'],
    synchronize: false,
    migrationsTableName: 'migrations_history',
  });
}

const dataSourcePromise = createDataSource();

export default dataSourcePromise;
