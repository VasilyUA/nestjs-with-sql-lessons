import * as bcrypt from 'bcryptjs';
import { UserModel } from '../../src/db/models/user.model';
import { RoleModel } from '../../src/db/models/role.model';

export const createUserWithRole = async (dto: object, roleName: string): Promise<any> => {
  const role = await RoleModel.create({ value: roleName, description: 'Test role user' }, { raw: true });
  const hashPassword = await bcrypt.hash(dto['password'], 5);
  const user = await UserModel.create({ ...dto, password: hashPassword });
  await user.$set('roles', [role.id]);

  return user;
};
