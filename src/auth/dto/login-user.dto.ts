import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Введіть email' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  @ApiProperty({ example: 'admin@gmail.com', description: 'Пошта' })
  readonly email: string;

  @IsNotEmpty({ message: 'Введіть пароль' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(2, 5, { message: 'Не меньше 2 и не больше 5' })
  @ApiProperty({ example: '2820', description: 'пароль' })
  readonly password: string;
}
