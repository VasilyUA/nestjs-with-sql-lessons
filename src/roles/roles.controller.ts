import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private releServices: RolesService) {}

  @Post()
  async createRole(@Body() dto: CreateRoleDto): Promise<any> {
    return this.releServices.createRole(dto);
  }

  @Get('/:value')
  getByValue(@Param('value') value: string): Promise<any> {
    return this.releServices.getRoleByValue(value);
  }
}
