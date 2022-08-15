import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Введіть email' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  @ApiProperty({ example: 'user@gmail.com', description: 'Почта' })
  readonly email: string;

  @IsNotEmpty()
  @IsString({ message: 'Должно быть строкой' })
  @Length(2, 5, { message: 'Не меньше 2 и не больше 5' })
  @ApiProperty({ example: '12345', description: 'пароль' })
  readonly password: string;
}
