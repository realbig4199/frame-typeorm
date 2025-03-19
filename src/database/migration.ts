import fs from 'fs';
import path from 'path';

const date = new Date();
const formattedDate = date.toISOString().replace(/[-:T]/g, '').slice(0, 14);

const migrationsDir = path.join(__dirname, 'migrations');
const filePath = path.join(migrationsDir, `${formattedDate}-migration.ts`);

const template = `
const { MigrationInterface, QueryRunner, Table } = require('typeorm');

module.exports = class Migration${formattedDate} {
  async up(queryRunner) {
    // TODO: Write migration logic here
  }

  async down(queryRunner) {
    // TODO: Write rollback logic here
  }
};
`;

fs.mkdirSync(migrationsDir, { recursive: true });
fs.writeFileSync(filePath, template.trim());

console.log(`✅ Migration created: ${filePath}`);
