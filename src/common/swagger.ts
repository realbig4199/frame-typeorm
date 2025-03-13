import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@/config/config.service';
import { ResponseDto } from '@/common/dto/response.dto';

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

  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [ResponseDto], // ResponseDto를 Swagger 문서에 등록
  });

  SwaggerModule.setup(config.get('swagger.path'), app, document, {
    jsonDocumentUrl: config.get('swagger.json'),
  });
};
