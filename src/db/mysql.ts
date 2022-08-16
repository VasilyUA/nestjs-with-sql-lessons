import { SequelizeModule } from '@nestjs/sequelize';
import { models } from './index';

export const mysql = SequelizeModule.forRoot(
  process.env.NODE_ENV === 'test'
    ? {
        dialect: 'sqlite',
        autoLoadModels: true,
        models: models,
        sync: { force: true },
        storage: ':memory:',
        uri: 'sqlite://:memory:',
      }
    : {
        dialect: 'mysql',
        host: process.env.MYSQL_HOST || 'localhost',
        port: Number(process.env.MYSQL_PORT) || 3306,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        models: models,
        // synchronize: true, // para que se ejecute la migracion automaticamente
        autoLoadModels: true,
      },
);
