import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserModel } from '../db/models/user.model';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async validateUser(userDto: CreateUserDto): Promise<any> {
    let user = await this.userService.getUserByEmail(userDto.email);
    if (!user) throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' });
    user = user.toJSON();
    const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    if (!passwordEquals) throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' });
    return user;
  }

  async registration(userDto: CreateUserDto) {
    const chackUser = await this.userService.getUserByEmail(userDto.email);
    if (chackUser) throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({ ...userDto, password: hashPassword });
    return this.generateToken(user.toJSON());
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  private async generateToken(user: UserModel) {
    const payload = { id: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
