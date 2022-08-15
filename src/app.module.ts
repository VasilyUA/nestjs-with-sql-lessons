import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import configuration from './config';
import { mysql } from './db/mysql';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AppController],
  providers: [],
  exports: [],
  imports: [configuration, mysql, UsersModule, RolesModule, AuthModule],
})
export class AppModule {}
