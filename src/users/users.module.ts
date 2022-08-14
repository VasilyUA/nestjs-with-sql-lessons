import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { implementsModelsInModule } from '../db/implementModelsInModule';
import { UsersService } from './users.service';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [implementsModelsInModule, RolesModule, forwardRef(() => AuthModule)],
  exports: [UsersService],
})
export class UsersModule {}
