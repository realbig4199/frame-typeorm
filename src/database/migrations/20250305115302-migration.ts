(() => {
  const {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
  } = require('typeorm');

  module.exports = class Migration20250305115302 {
    async up(queryRunner) {
      await queryRunner.dropColumn('users', 'name');

      await queryRunner.addColumns('users', [
        new TableColumn({
          name: 'gender',
          type: 'varchar',
          isNullable: false,
          default: "'Unknown'",
        }),
        new TableColumn({
          name: 'phone',
          type: 'varchar',
          isNullable: true,
          isUnique: true,
        }),
        new TableColumn({
          name: 'email',
          type: 'varchar',
          isNullable: true,
          isUnique: true,
        }),
      ]);
    }

    async down(queryRunner) {
      await queryRunner.dropColumn('users', 'gender');
      await queryRunner.dropColumn('users', 'phone');
      await queryRunner.dropColumn('users', 'email');

      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'name',
          type: 'varchar',
          isNullable: false,
        }),
      );
    }
  };
})();
