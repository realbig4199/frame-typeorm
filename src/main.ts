import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from '@/common/swagger';
import { ConfigService } from '@/config/config.service';
import { seed } from '@/database/seed';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  setupSwagger(app);

  await seed();

  await app.listen(config.get('httpPort'));
}
bootstrap();
