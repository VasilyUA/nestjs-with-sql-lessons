import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../db/models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModel) private userRepository: typeof UserModel, private rolesService: RolesService) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    let role = await this.rolesService.getRoleByValue('USER');
    if (!role) throw new HttpException('Роль для користувача не знайдена', HttpStatus.BAD_REQUEST);
    role = role.toJSON();
    await user.$set('roles', [role.id]);
    user.roles = [role];

    return user;
  }

  async getAllUser() {
    return this.userRepository.findAll({ include: { all: true } });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
}
