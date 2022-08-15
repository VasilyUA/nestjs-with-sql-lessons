import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './gaurds/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  @UsePipes(ValidationPipe)
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  @UseGuards(LocalAuthGuard)
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }
}
