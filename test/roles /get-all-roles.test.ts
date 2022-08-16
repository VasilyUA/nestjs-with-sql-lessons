import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import * as _ from 'lodash';

import { AppModule } from '../../src/app.module';
import { createUserWithRole } from '../__helpers__/create-user-with-role.__helpers__';

jest.setTimeout(45000);

describe('Get list with roles', () => {
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

  it("GET '/roles' get roles when user unauthorize", async () => {
    const loginResponse = await request.post('/login').send(mockUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request.get('/roles').set('Authorization', token).set('Accept', 'application/json').expect(401).expect({ statusCode: 401, message: 'Unauthorized' });
  });

  it("GET '/roles' get roles when user not have permisions", async () => {
    const loginResponse = await request.post('/login').send(mockUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request.get('/roles').set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').expect(403).expect({ statusCode: 403, message: 'Нет доступа' });
  });

  it("GET '/roles' get roles success", async () => {
    const loginResponse = await request.post('/login').send(mockAdminUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request
      .get('/roles')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        const resData = _.get(res, 'body', []);
        expect(resData.length).toBe(2);
        expect(resData[0].value).toBe('ADMIN');
        expect(resData[1].value).toBe('USER');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
