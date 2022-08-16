import { Module, forwardRef } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { implementsModelsInModule } from '../db/implementModelsInModule';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [implementsModelsInModule, forwardRef(() => UsersModule), forwardRef(() => AuthModule)],
  exports: [RolesService],
})
export class RolesModule {}
