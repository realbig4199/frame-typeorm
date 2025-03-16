import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { JwtAuthService } from '@/api/jwt/jwt.service';
import { TokenType } from '@/api/jwt/jwt.type';
import { DataSource } from 'typeorm';
import { UserEntity } from '@/database/entity/user.entity';
import { LoginEntity } from '@/database/entity/login.entity';

describe('UserController (E2E)', () => {
  let app: INestApplication;
  let jwtService: JwtAuthService;
  let accessToken: string;
  const testUserUuid: string = 'b6d7a364-f4f4-11ef-bed5-0242ac140003';

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
    console.log('응답',response.body.result.users);

    expect(Array.isArray(response.body.result.users)).toBe(true);
    if (response.body.result.users.length > 0) {
      const user = response.body.result.users[0];
      expect(user).toHaveProperty('userUuid');
      expect(user).toHaveProperty('gender');
      expect(user).toHaveProperty('phone');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('passid');
    }
  });

  it('/user/:uuid (GET) - 유저를 상세조회한다.', async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/${testUserUuid}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('userUuid', testUserUuid);
    expect(response.body).toHaveProperty('gender');
    expect(response.body).toHaveProperty('phone');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('passid');
  });

  it('/user/:uuid (DELETE) - 유저를 삭제한다.', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/user/${testUserUuid}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      statusCode: HttpStatus.OK,
      message: '유저가 삭제되었습니다.',
    });

    console.log(`🗑 유저 ${testUserUuid} 삭제 완료`);

    // 🔄 삭제된 유저 복원
    const dataSource = app.get(DataSource);
    if (dataSource && dataSource.isInitialized) {
      const userRepository = dataSource.getRepository(UserEntity);
      const loginRepository = dataSource.getRepository(LoginEntity);

      const deletedUser = await userRepository.findOne({
        where: { uuid: testUserUuid },
        relations: ['login'],
        withDeleted: true, // soft delete 된 데이터 포함 조회
      });

      if (deletedUser) {
        await userRepository.recover(deletedUser);
        console.log(`🔄 유저 ${deletedUser.uuid} 복원 완료`);
      }

      // 로그인 정보 복원
      const deletedLogin = await loginRepository.findOne({
        where: { id: deletedUser?.login.id },
        withDeleted: true,
      });

      if (deletedLogin) {
        await loginRepository.recover(deletedLogin);
        console.log(`🔄 로그인 정보 ${deletedLogin.id} 복원 완료`);
      }
    }
  });
});
