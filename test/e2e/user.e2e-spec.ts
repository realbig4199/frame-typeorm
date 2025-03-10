import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { JwtAuthService } from '@/api/jwt/jwt.service';
import { TokenType } from '@/api/jwt/jwt.type';
import { DataSource } from 'typeorm';

describe('UserController (E2E)', () => {
  let app: INestApplication;
  let jwtService: JwtAuthService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = app.get(JwtAuthService);

    const accessPayload = await jwtService.generatePayload(
      'test-user-uuid',
      TokenType.Access,
    );
    const refreshPayload = await jwtService.generatePayload(
      'test-user-uuid',
      TokenType.Refresh,
    );

    const token = await jwtService.generateToken(accessPayload, refreshPayload);
    accessToken = token.accessToken;
  });

  afterAll(async () => {
    await app.close();

    const dataSource = app.get(DataSource);
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('/user (GET) - 유저를 조회한다.', async () => {
    const response = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        offset: 0,
        limit: 10,
        sortBy: 'createdAt',
        order: 'DESC',
      })
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body.users)).toBe(true);
    if (response.body.users.length > 0) {
      const user = response.body.users[0];
      expect(user).toHaveProperty('userUuid');
      expect(user).toHaveProperty('gender');
      expect(user).toHaveProperty('phone');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('passid');
    }
  });
});
