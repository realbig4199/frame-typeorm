import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Migration20250304103219 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'logins',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'uuid', type: 'varchar', isUnique: true, default: 'UUID()' },
          { name: 'state', type: 'varchar', default: "'Activation'" },
          { name: 'passid', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'uuid', type: 'varchar', isUnique: true, default: 'UUID()' },
          { name: 'state', type: 'varchar', default: "'Activation'" },
          { name: 'name', type: 'varchar' },
          { name: 'login_id', type: 'int', isUnique: true, isNullable: true },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
        foreignKeys: [
          {
            columnNames: ['login_id'],
            referencedTableName: 'logins',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('logins');
  }
}
