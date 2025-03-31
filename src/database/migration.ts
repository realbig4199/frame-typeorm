import { winstonConfig } from '@/common/logger/winston.config';
import { WinstonModule } from 'nest-winston';
import fs from 'fs';
import path from 'path';

const logger = WinstonModule.createLogger(winstonConfig);

const date = new Date();
const formattedDate = date.toISOString().replace(/[-:T]/g, '').slice(0, 14);

const migrationsDir = path.join(__dirname, 'migrations');
const filePath = path.join(migrationsDir, `${formattedDate}-migration.ts`);

const template = `
  import { Table } from 'typeorm';

  export default class Migration${formattedDate} {
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

logger.log({
  level: 'info',
  message: `✅ Migration created: ${filePath}`,
  context: 'MigrationGenerator',
});
