const fs = require('fs');
const path = require('path');

const date = new Date();
const formattedDate = date.toISOString().replace(/[-:T]/g, '').slice(0, 14);

const migrationsDir = path.join(__dirname, 'migrations');
const filePath = path.join(migrationsDir, `${formattedDate}-migration.ts`);

const template = `
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration${formattedDate} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // TODO: Write migration logic here
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO: Write rollback logic here
  }
}
`;

fs.mkdirSync(migrationsDir, { recursive: true });

fs.writeFileSync(filePath, template.trim());

console.log(`✅ Migration created: ${filePath}`);
