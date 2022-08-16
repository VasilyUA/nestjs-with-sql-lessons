import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import * as _ from 'lodash';

import { AppModule } from '../../src/app.module';
import { createUserWithRole } from '../__helpers__/create-user-with-role.__helpers__';

jest.setTimeout(45000);

describe('Add roles for users', () => {
  let app: INestApplication;
  let request: any;

  const mockRoleAdmin = 'ADMIN';
  const mockRoleUser = 'USER';
  const mockAdminUser: object = { id: 1, email: 'admin@gmail.com', password: 'Пошта' };
  const mockUser: object = { id: 2, email: 'user@gmail.com', password: 'Пошта' };

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {}); // eslint-disable-line
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    request = supertest(app.getHttpServer());
    await createUserWithRole(mockAdminUser, mockRoleAdmin);
    await createUserWithRole(mockUser, mockRoleUser);
  });

  it("PATCH '/users/:userId/:roleName' add role for user when user unauthorize", async () => {
    const loginResponse = await request.post('/login').send(mockUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request
      .patch(`/users/${mockUser['id']}/${mockRoleUser}`)
      .send(mockUser)
      .set('Authorization', token)
      .set('Accept', 'application/json')
      .expect(401)
      .expect({ statusCode: 401, message: 'Unauthorized' });
  });

  it("PATCH '/users/:userId/:roleName' add role for user when user not have permisions", async () => {
    const loginResponse = await request.post('/login').send(mockUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request
      .patch(`/users/${mockUser['id']}/${mockRoleUser}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(403)
      .expect({ statusCode: 403, message: 'Нет доступа' });
  });

  it("PATCH '/users/:userId/:roleName' add role for user when user not exist", async () => {
    const loginResponse = await request.post('/login').send(mockAdminUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request
      .patch(`/users/3/${mockRoleAdmin}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(404)
      .expect({ statusCode: 404, message: 'Користувач не знайдено' });
  });

  it("PATCH '/users/:userId/:roleName' add role for user when role not found", async () => {
    const loginResponse = await request.post('/login').send(mockAdminUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request
      .patch(`/users/${mockUser['id']}/TEST`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(404)
      .expect({ statusCode: 404, message: 'Роль для користувача не знайдена' });
  });

  it("PATCH '/users/:userId/:roleName' add role for user success", async () => {
    const loginResponse = await request.post('/login').send(mockAdminUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request
      .patch(`/users/${mockUser['id']}/${mockRoleAdmin}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        const resData = _.get(res, 'body', {});
        expect(resData).toHaveProperty('id', mockUser['id']);
        expect(resData).toHaveProperty('email', mockUser['email']);
        expect(resData.roles).toBeDefined();
        expect(resData.roles).toHaveLength(2);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
