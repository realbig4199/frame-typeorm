import * as dotenv from 'dotenv-flow';
dotenv.config();

import { DataSource } from 'typeorm';

async function createDataSource(): Promise<DataSource> {
  return new DataSource({
    type: process.env.DB_TYPE as 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/entity/*.entity.{ts,js}'],
    migrations: [__dirname + '/migrations/*.{ts,js}'],
    synchronize: false,
    migrationsTableName: 'migrations_history',
    extra: {
      multipleStatements: true,
    },
  });
}

const dataSourcePromise = createDataSource();

export default dataSourcePromise;
