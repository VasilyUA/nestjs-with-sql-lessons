import { SequelizeModule } from '@nestjs/sequelize';
import { models } from './index';

export const implementsModelsInModule = SequelizeModule.forFeature(models);
