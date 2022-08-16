import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import * as _ from 'lodash';

import { AppModule } from '../../src/app.module';
import { RoleModel } from '../../src/db/models/role.model';
import { UserModel } from '../../src/db/models/user.model';

jest.setTimeout(45000);

describe('Authorization and registration', () => {
  let app: INestApplication;
  let request: any;
  const mockUser: object = { email: 'user@gmail.com', password: 'Пошта' };

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {}); // eslint-disable-line
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    request = supertest(app.getHttpServer());
  });

  it("POST '/registration' Create user bedrequest", () => {
    const mockUser = {};
    return request
      .post('/registration')
      .send(mockUser)
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        const resData = _.get(response, 'body', []);
        const chekedData = [
          'email - Некорректный email, Должно быть строкой, Введіть email, Має бути лише @gmail.com',
          'password - Не меньше 2 и не больше 5, Должно быть строкой, password should not be empty',
        ];

        resData.forEach((item, index) => {
          expect(item).toBe(chekedData[index]);
        });
      });
  });

  it("POST '/registration' Create user role not found", () => {
    return request
      .post('/registration')
      .send(mockUser)
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        const resData = _.get(response, 'body', {});
        expect(resData.message).toBe('Роль для користувача не знайдена');
      });
  });

  it("POST '/registration' Create user success", async () => {
    await RoleModel.create({ value: 'USER', description: 'Tes role user' });
    return request
      .post('/registration')
      .send(mockUser)
      .set('Accept', 'application/json')
      .expect(201)
      .then((response) => {
        const resData = _.get(response, 'body', {});
        expect(resData.access_token).toBeDefined();
        expect(resData.access_token.length).toBeGreaterThan(0);
      });
  });

  it("POST '/registration' Create user success", async () => {
    return request.post('/registration').send(mockUser).set('Accept', 'application/json').expect(400).expect({ statusCode: 400, message: 'Пользователь с таким email существует' });
  });

  it("POST '/login' Check password hash", async () => {
    const user = await UserModel.findOne({ where: { email: mockUser['email'] }, raw: true });
    expect(user.password).not.toBe(mockUser['password']);
  });

  it("POST '/login' Login user unauthorized", async () => {
    const mockUser = { email: '', password: '' };
    return request
      .post('/login')
      .send(mockUser)
      .set('Accept', 'application/json')
      .expect(401)
      .then((response) => {
        const resData = _.get(response, 'body', {});
        expect(resData.message).toBe('Unauthorized');
      });
  });

  it("POST '/login' Login user success", async () => {
    return request
      .post('/login')
      .send(mockUser)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        const resData = _.get(response, 'body', {});
        expect(resData.access_token).toBeDefined();
        expect(resData.access_token.length).toBeGreaterThan(0);
      });
  });

  it("POST '/login' Login user incorect email", async () => {
    return request
      .post('/login')
      .send({ ...mockUser, password: 'Поштаc' })
      .set('Accept', 'application/json')
      .expect(401)
      .then({ message: 'Некорректный емайл или пароль' });
  });

  it("POST '/login' Login user success", async () => {
    await UserModel.destroy({ where: { email: mockUser['email'] } });
    return request.post('/login').send(mockUser).set('Accept', 'application/json').expect(401).then({ message: 'Некорректный емайл или пароль' });
  });

  afterAll(async () => {
    await app.close();
  });
});
