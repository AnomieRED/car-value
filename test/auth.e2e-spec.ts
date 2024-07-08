import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('[/auth/sinup] (POST)', async () => {
    const email = 'test@e2e.com';

    return await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'test@e2e.com' })
      .expect(201)
      .then((res) => {
        const { id, email: currEmail } = res.body;
        expect(id).toBeDefined();
        expect(currEmail).toEqual(email)
      });

  });
});
