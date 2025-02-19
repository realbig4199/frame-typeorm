import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from '@/common/swagger';
import { ConfigService } from '@/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  setupSwagger(app);
  await app.listen(config.get('httpPort'));
}
bootstrap();
