import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserModel } from '../db/models/user.model';
import { RolesGuard } from '../auth/gaurds/roles.guard';
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.guard';
import { ValidationPipe } from '../pipes/validation.pipe';
import { Roles } from '../patterns/decorators/roles-auth.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Користувачі')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Створення користувача доступно тільки для адміна' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({ status: 200, type: UserModel })
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Post()
  createUserByAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUserByAdmin(createUserDto);
  }

  @ApiOperation({ summary: 'Отримати всіх користувачів доступно тільки для адміна' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({ status: 200, type: [UserModel] })
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUser();
  }

  @ApiOperation({ summary: 'Додати роль для користувача доступно тільки для адміна' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({ status: 200, type: UserModel })
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/:userId/:roleName')
  AddRoleForUser(@Param('userId') userId: number, @Param('roleName') roleName: string) {
    return this.usersService.AddRoleForUser(userId, roleName);
  }
}
