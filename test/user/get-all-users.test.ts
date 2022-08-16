import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import * as _ from 'lodash';

import { AppModule } from '../../src/app.module';
import { UserModel } from '../../src/db/models/user.model';
import { createUserWithRole } from '../__helpers__/create-user-with-role.__helpers__';

jest.setTimeout(45000);

describe('Get List with Users', () => {
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

  it("GET '/users' get all users when user unauthorize", async () => {
    const loginResponse = await request.post('/login').send(mockUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request.get('/users').send(mockUser).set('Authorization', token).set('Accept', 'application/json').expect(401).expect({ statusCode: 401, message: 'Unauthorized' });
  });

  it("GET '/users' get all users not have permisions", async () => {
    const loginResponse = await request.post('/login').send(mockUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request.get('/users').set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').expect(403).expect({ statusCode: 403, message: 'Нет доступа' });
  });

  it("GET '/users' get list with all users success", async () => {
    const loginResponse = await request.post('/login').send(mockAdminUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        const resData = _.get(res, 'body', '');
        const user: object = _.find(resData, { email: mockUser['email'] });
        expect(user).toBeDefined();
        expect(user['password']).not.toBeDefined();
        expect(resData).toHaveLength(2);
        expect(user).toHaveProperty('email', mockUser['email']);
        expect(user).toHaveProperty('roles');
        expect(user['roles']).toHaveLength(1);
        expect(user['roles'][0]).toHaveProperty('value', 'USER');
      });
  });

  it("GET '/users' get all users not found user facke id", async () => {
    const loginResponse = await request.post('/login').send(mockUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');
    await UserModel.destroy({ where: { email: mockUser['email'] } });
    return request.get('/users').set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').expect(401).expect({ message: 'Ви не авторизовані' });
  });

  afterAll(async () => {
    await app.close();
  });
});
