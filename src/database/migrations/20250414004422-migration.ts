import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCommonCodeTables20250414000200
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 공통 코드 그룹 테이블 생성
    await queryRunner.createTable(
      new Table({
        name: 'common_code_group',
        columns: [
          { name: 'group_code', type: 'varchar', length: '3', isPrimary: true },
          { name: 'group_name', type: 'varchar', length: '30' },
          { name: 'remark', type: 'varchar', length: '100', isNullable: true },
          { name: 'use_yn', type: 'char', length: '1', default: "'Y'" },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_by',
            type: 'varchar',
            length: '20',
            default: "'SYSTEM'",
          },
          {
            name: 'updated_by',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
        ],
      }),
    );

    // 공통 코드 테이블 생성
    await queryRunner.createTable(
      new Table({
        name: 'common_code',
        columns: [
          { name: 'code', type: 'varchar', length: '6', isPrimary: true },
          { name: 'group_code', type: 'varchar', length: '3' },
          { name: 'name', type: 'varchar', length: '20' },
          { name: 'remark', type: 'varchar', length: '100', isNullable: true },
          { name: 'sort_order', type: 'int' },
          { name: 'use_yn', type: 'char', length: '1', default: "'Y'" },
          { name: 'depth', type: 'int', default: 1 },
          {
            name: 'parent_code',
            type: 'varchar',
            length: '6',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_by',
            type: 'varchar',
            length: '20',
            default: "'SYSTEM'",
          },
          {
            name: 'updated_by',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['group_code'],
            referencedTableName: 'common_code_group',
            referencedColumnNames: ['group_code'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
    );

    // 코드 그룹 데이터 삽입
    await queryRunner.query(`
      INSERT INTO common_code_group (group_code, group_name, remark, use_yn, created_at, created_by)
      VALUES
        ('C01', 'COOKING_LEVEL', '요리 실력 구분', 'Y', CURRENT_TIMESTAMP, 'SYSTEM'),
        ('H01', 'HOUSEHOLD_TYPE', '가구 형태 구분', 'Y', CURRENT_TIMESTAMP, 'SYSTEM'),
        ('J01', 'JOB', '직업 분류', 'Y', CURRENT_TIMESTAMP, 'SYSTEM')
    `);

    // 코드 항목 데이터 삽입
    await queryRunner.query(`
      INSERT INTO common_code (code, group_code, name, remark, sort_order, use_yn, depth, created_at, created_by)
      VALUES
        -- COOKING_LEVEL
        ('C01001', 'C01', '초보자', '요리 실력', 1, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM'),
        ('C01002', 'C01', '숙련자', '요리 실력', 2, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM'),
        ('C01003', 'C01', '전문가', '요리 실력', 3, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM'),

        -- HOUSEHOLD_TYPE
        ('H01001', 'H01', '1인 가구', '가구 형태', 1, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM'),
        ('H01002', 'H01', '2인 가구', '가구 형태', 2, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM'),
        ('H01003', 'H01', '3인 이상', '가구 형태', 3, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM'),
        ('H01004', 'H01', '기타', '가구 형태', 4, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM'),

        -- JOB
        ('J01001', 'J01', '학생', '직업', 1, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM'),
        ('J01002', 'J01', '주부', '직업', 2, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM'),
        ('J01003', 'J01', '직장인', '직업', 3, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM'),
        ('J01004', 'J01', '무직', '직업', 4, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM'),
        ('J01005', 'J01', '자영업자', '직업', 5, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM'),
        ('J01006', 'J01', '기타', '직업', 6, 'Y', 1, CURRENT_TIMESTAMP, 'SYSTEM')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('common_code');
    await queryRunner.dropTable('common_code_group');
  }
}
