import { UserModel } from './models/user.model';
import { RoleModel } from './models/role.model';
import { UserRolesModel } from './models/manyToMany/user-roles.model';

export const models = [UserModel, RoleModel, UserRolesModel];
