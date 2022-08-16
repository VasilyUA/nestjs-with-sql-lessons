import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../db/models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { hashPassword } from '../helpers/bcrypt-password';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModel) private userRepository: typeof UserModel, private rolesService: RolesService, private sequelize: Sequelize) {}

  async createUser(dto: CreateUserDto) {
    try {
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const newUser = await this.userRepository.create(dto, transactionHost);
        let role = await this.rolesService.getRoleByValue('USER');

        role = role.toJSON();
        await newUser.$set('roles', [role.id], transactionHost);
      });
      const newUser = await this.getUserByEmail(dto.email);

      return newUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createUserByAdmin(dto: CreateUserDto) {
    const checkUserExist = await this.getUserByEmail(dto.email);
    if (checkUserExist) throw new HttpException('Користувач з таким email вже існує', HttpStatus.BAD_REQUEST);

    const user = await hashPassword(dto);

    return this.createUser(user);
  }

  async getAllUser() {
    return this.userRepository.findAll({ include: { all: true }, attributes: { exclude: ['password'] } });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email }, include: { all: true }, attributes: { exclude: ['password'] } });
  }

  async getUserByIdWithPassword(email: string) {
    return this.userRepository.findOne({ where: { email }, include: { all: true } });
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({ where: { id }, include: { all: true }, attributes: { exclude: ['password'] } });
  }

  async AddRoleForUser(userId: number, roleName: string) {
    const userDocument = await this.getUserById(userId);
    if (!userDocument) throw new HttpException('Користувач не знайдено', HttpStatus.NOT_FOUND);

    const roleDocument = await this.rolesService.getRoleByValue(roleName);

    const role = roleDocument.toJSON();
    await userDocument.$set('roles', [role.id]);

    const user = userDocument.toJSON();
    user.roles.push(role);

    return user;
  }
}
