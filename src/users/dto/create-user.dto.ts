import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { CustomEmailValidation } from '../validation/email.validation';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Введіть email' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  @Validate(CustomEmailValidation, { message: 'Має бути лише @gmail.com' })
  @ApiProperty({ example: 'user@gmail.com', description: 'Почта' })
  readonly email: string;

  @IsNotEmpty()
  @IsString({ message: 'Должно быть строкой' })
  @Length(2, 5, { message: 'Не меньше 2 и не больше 5' })
  @ApiProperty({ example: '12345', description: 'пароль' })
  readonly password: string;
}
