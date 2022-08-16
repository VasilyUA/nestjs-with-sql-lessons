import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import * as _ from 'lodash';

import { AppModule } from '../../src/app.module';
import { createUserWithRole } from '../__helpers__/create-user-with-role.__helpers__';

jest.setTimeout(45000);

describe('Search role', () => {
  let app: INestApplication;
  let request: any;
  const mockUser: object = { email: 'user@gmail.com', password: 'Пошта' };
  const mockAdminUser: object = { email: 'admin@gmail.com', password: 'Пошта' };

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {}); // eslint-disable-line
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    request = supertest(app.getHttpServer());
    await createUserWithRole(mockAdminUser, 'ADMIN');
    await createUserWithRole(mockUser, 'USER');
  });

  it("GET '/roles/:roleName' get role when user unauthorize", async () => {
    const loginResponse = await request.post('/login').send(mockUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request.get('/roles/ADMIN').set('Authorization', token).set('Accept', 'application/json').expect(401).expect({ statusCode: 401, message: 'Unauthorized' });
  });

  it("POST '/roles/:roleName' get role when user not have permisions", async () => {
    const loginResponse = await request.post('/login').send(mockUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request.get('/roles/ADMIN').set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').expect(403).expect({ statusCode: 403, message: 'Нет доступа' });
  });

  it("POST '/roles/:roleName' get role when role not found", async () => {
    const loginResponse = await request.post('/login').send(mockAdminUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request.get('/roles/ADMINS').set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').expect(404).expect({ statusCode: 404, message: 'Роль для користувача не знайдена' });
  });

  it("POST '/roles/:roleName' get role success", async () => {
    const loginResponse = await request.post('/login').send(mockAdminUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request
      .get('/roles/ADMIN')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        const resData = _.get(res, 'body', {});
        expect(resData.value).toBe('ADMIN');
        expect(resData.description).toBe('Test role user');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
