import { Table } from 'typeorm';

module.exports = class Migration20250305120000 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'boards',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'title', type: 'varchar' },
          { name: 'content', type: 'text' },
          { name: 'createdBy', type: 'int' },
          { name: 'updatedBy', type: 'int', isNullable: true },
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
            columnNames: ['createdBy'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE', // 유저 삭제 시 게시글도 삭제됨
          },
          {
            columnNames: ['updatedBy'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL', // 유저가 삭제되면 updatedBy는 NULL로 설정
          },
        ],
      }),
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable('boards');
  }
};
