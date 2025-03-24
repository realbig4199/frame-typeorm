import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@/config/config.service';
import { ResponseDto } from '@/common/dto/response.dto';

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title'))
    .setDescription(configService.get<string>('swagger.description'))
    .setVersion(configService.get<string>('swagger.version'))
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [ResponseDto],
    deepScanRoutes: true,
  });

  SwaggerModule.setup(
    configService.get<string>('swagger.path'),
    app,
    document,
    {
      jsonDocumentUrl: configService.get<string>('swagger.json'),
      swaggerOptions: {
        // docExpansion: 'none', // group 닫기
        persistAuthorization: true, // 새로고침 토큰 유지
      },
    },
  );
}
