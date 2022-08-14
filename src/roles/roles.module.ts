import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { implementsModelsInModule } from '../db/implementModelsInModule';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [implementsModelsInModule],
  exports: [RolesService],
})
export class RolesModule {}
