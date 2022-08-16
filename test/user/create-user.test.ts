import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import * as _ from 'lodash';

import { AppModule } from '../../src/app.module';
import { RoleModel } from '../../src/db/models/role.model';
import { UserModel } from '../../src/db/models/user.model';
import { UserRolesModel } from '../../src/db/models/manyToMany/user-roles.model';
import { createUserWithRole } from '../__helpers__/create-user-with-role.__helpers__';

jest.setTimeout(45000);

describe('Creat user as an admin', () => {
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
    await RoleModel.create({ value: 'USER', description: 'Test role user' });
    await createUserWithRole(mockAdminUser, 'ADMIN');
  });

  it("POST '/users' Unauthorized without token", async () => {
    return request.post('/users').send(mockUser).set('Accept', 'application/json').expect(401).expect({ statusCode: 401, message: 'Unauthorized' });
  });

  it("POST '/users' Unauthorized without bearer", async () => {
    const loginResponse = await request.post('/login').send(mockAdminUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request.post('/users').send(mockUser).set('Authorization', token).set('Accept', 'application/json').expect(401).expect({ statusCode: 401, message: 'Unauthorized' });
  });

  it("POST '/users' Creating a user role not found", async () => {
    await RoleModel.update({ value: 'USERS' }, { where: { value: 'USER' } });
    const loginResponse = await request.post('/login').send(mockAdminUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request
      .post('/users')
      .send(mockUser)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(400)
      .expect({ statusCode: 400, message: 'Роль для користувача не знайдена' });
  });

  it("POST '/users' Creating a user as an admin success", async () => {
    await RoleModel.update({ value: 'USER' }, { where: { value: 'USERS' } });
    const loginResponse = await request.post('/login').send(mockAdminUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request
      .post('/users')
      .send(mockUser)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(201)
      .then((response) => {
        const resData = _.get(response, 'body', {});
        expect(resData.email).toBe(mockUser['email']);
        expect(resData.roles[0].value).toBe('USER');
      });
  });

  it("POST '/users' Check password hash", async () => {
    const user = await UserModel.findOne({ where: { email: mockUser['email'] }, raw: true });
    expect(user.password).not.toBe(mockUser['password']);
  });

  it("POST '/users' Creating a user as an admin", async () => {
    const loginResponse = await request.post('/login').send(mockAdminUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request
      .post('/users')
      .send(mockUser)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(400)
      .expect({ statusCode: 400, message: 'Користувач з таким email вже існує' });
  });

  it("POST '/users' Not access", async () => {
    await UserRolesModel.update({ roleId: 1 }, { where: { userId: 1 } });
    const loginResponse = await request.post('/login').send(mockAdminUser).set('Accept', 'application/json');
    const token = _.get(loginResponse, 'body.access_token', '');

    return request
      .post('/users')
      .send(mockUser)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(403)
      .then((res) => {
        expect(res.body.message).toBe('Нет доступа');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
