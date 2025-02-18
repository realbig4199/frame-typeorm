import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { DataSource, QueryRunner, EntityManager } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  constructor(private readonly dataSource: DataSource) {}

  public async initializeConnection(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
      console.log('Database connection initialized');
    }
  }

  public async transaction<T>(
    task: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await task(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public query(tableName: string, alias?: string) {
    return this.dataSource
      .getRepository(tableName)
      .createQueryBuilder(alias || tableName);
  }

  public async raw<T>(query: string, parameters?: any[]): Promise<T> {
    return await this.dataSource.query(query, parameters);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      console.log('Database connection closed');
    }
  }
}
