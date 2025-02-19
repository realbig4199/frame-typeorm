import { ConfigService } from '@/config/config.service';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): void => {
  const config = app.get(ConfigService);
  const options = new DocumentBuilder()
    .setTitle(config.get('swagger.title'))
    .setVersion(config.get('swagger.version'))
    .setDescription(config.get('swagger.description'))
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', name: 'JWT', in: 'header' },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.get('swagger.path'), app, document, {
    jsonDocumentUrl: config.get('swagger.json'),
  });
};
