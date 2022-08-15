import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Roles } from 'src/patterns/decorators/roles-auth.decorator';
import { RolesGuard } from 'src/auth/gaurds/roles.guard';

@Controller('roles')
export class RolesController {
  constructor(private releServices: RolesService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async createRole(@Body() dto: CreateRoleDto): Promise<any> {
    return this.releServices.createRole(dto);
  }

  @Get('/:value')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  getByValue(@Param('value') value: string): Promise<any> {
    return this.releServices.getRoleByValue(value);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  getAll(): Promise<any> {
    return this.releServices.getAllRoles();
  }
}
