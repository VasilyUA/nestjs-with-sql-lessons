import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'USER', description: 'Назва ролі' })
  readonly value: string;

  @ApiProperty({ example: 'Ця роль використовується для звичайних користувачів платформи', description: 'Опис ролі' })
  readonly description: string;
}
