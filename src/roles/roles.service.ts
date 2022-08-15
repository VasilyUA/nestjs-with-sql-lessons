import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleModel } from '../db/models/role.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(RoleModel) private roleRepository: typeof RoleModel) {}

  async createRole(dto: CreateRoleDto): Promise<any> {
    const checkUser = await this.roleRepository.findOne({ where: { value: dto.value } });
    if (checkUser) throw new HttpException('Роль с таким значением уже существует', HttpStatus.BAD_REQUEST);
    const role = await this.roleRepository.create(dto);
    return role;
  }

  async getRoleByValue(value: string): Promise<any> {
    const role = await this.roleRepository.findOne({ where: { value } });
    return role;
  }

  async getAllRoles(): Promise<any> {
    const roles = await this.roleRepository.findAll();
    return roles;
  }
}
