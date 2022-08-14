import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import configuration from './config';
import { mysql } from './db/mysql';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [configuration, mysql, UsersModule, RolesModule, AuthModule],
})
export class AppModule {}
