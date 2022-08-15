import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserModel } from 'src/db/models/user.model';
import { RolesGuard } from 'src/auth/gaurds/roles.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { Roles } from 'src/patterns/decorators/roles-auth.decorator';
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
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Отримати всіх користувачів доступно тільки для адміна' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({ status: 200, type: [UserModel] })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUser();
  }

  @ApiOperation({ summary: 'Додати роль для користувача доступно тільки для адміна' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({ status: 200, type: UserModel })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Patch('/:userId/:roleName')
  AddRoleForUser(@Param('userId') userId: number, @Param('roleName') roleName: string) {
    return this.usersService.AddRoleForUser(userId, roleName);
  }
}
