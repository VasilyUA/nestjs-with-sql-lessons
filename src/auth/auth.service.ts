import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserModel } from '../db/models/user.model';
import { LoginUserDto } from './dto/login-user.dto';
import { hashPassword, comparePassword } from '../helpers/bcrypt-password';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async validateUser(userDto: LoginUserDto): Promise<any> {
    let user = await this.userService.getUserByIdWithPassword(userDto.email);
    if (!user) throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' });
    user = user.toJSON();

    const passwordEquals = await comparePassword(userDto.password, user.password);
    if (!passwordEquals) throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' });
    return user;
  }

  async validateUserById(id: number): Promise<any> {
    const user = await this.userService.getUserById(id);
    if (!user) throw new UnauthorizedException({ message: 'Ви не авторизовані' });
    return user;
  }

  async registration(userDto: CreateUserDto) {
    const chackUser = await this.userService.getUserByEmail(userDto.email);
    if (chackUser) throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
    const userHashPassword = await hashPassword(userDto);
    const user = await this.userService.createUser(userHashPassword);
    return this.generateToken(user.toJSON());
  }

  async login(user: UserModel) {
    return this.generateToken(user);
  }

  private async generateToken(user: UserModel) {
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
