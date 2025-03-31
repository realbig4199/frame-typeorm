import * as dotenv from 'dotenv-flow';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from '@/common/swagger';
import { ConfigService } from '@/config/config.service';
import { seed } from '@/database/seed';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { VersioningType } from '@nestjs/common';

import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@/common/logger/winston.config';
import { LoggerFactoryService } from '@/common/logger/logger-factory.service';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  const loggerFactory = app.get(LoggerFactoryService);
  const logger = loggerFactory.create(bootstrap.name);

  const config = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  setupSwagger(app);
  await seed();

  const port = config.get<number>('HTTP_PORT');
  await app.listen(port);

  logger.log(
    `🚀 Server running on http://localhost:${port} 🌱 [env: ${process.env.ENV}]`,
  );
}

bootstrap().catch((err) => {
  // bootstrap 실패 시 app이 초기화되지 않은 상태로, LoggerFactoryService 사용 불가
  const fallbackLogger = WinstonModule.createLogger(winstonConfig);
  fallbackLogger.error('❌ Failed to bootstrap the app', {
    stack: err.stack,
    context: 'Bootstrap',
  });
  process.exit(1);
});
