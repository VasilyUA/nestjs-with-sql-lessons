import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/patterns/decorators/roles-auth.decorator';
import { RolesGuard } from 'src/auth/gaurds/roles.guard';
import { RoleModel } from 'src/db/models/role.model';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@ApiTags('Ролі')
@Controller('roles')
export class RolesController {
  constructor(private releServices: RolesService) {}

  @ApiOperation({ summary: 'Створення ролі доступно тільки для адміна' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({ status: 200, type: RoleModel })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  async createRole(@Body() dto: CreateRoleDto): Promise<any> {
    return this.releServices.createRole(dto);
  }

  @ApiOperation({ summary: 'Пошук ролі доступно тільки для адміна' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({ status: 200, type: RoleModel })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get('/:roleName')
  getByValue(@Param('roleName') roleName: string): Promise<any> {
    return this.releServices.getRoleByValue(roleName);
  }

  @ApiOperation({ summary: 'Пошук ролі доступно тільки для адміна' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({ status: 200, type: [RoleModel] })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll(): Promise<any> {
    return this.releServices.getAllRoles();
  }
}
