import { Body, Controller, Post, Request, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../pipes/validation.pipe';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from './gaurds/local-auth.guard';

@ApiTags('Авторизація')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Реєстрація користувача з ролею користувач платформи' })
  @ApiResponse({ status: 200, type: Object })
  @UsePipes(ValidationPipe)
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @ApiOperation({ summary: 'Логін користувача' })
  @ApiResponse({ status: 200, type: Object })
  @UsePipes(ValidationPipe)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() userDto: LoginUserDto, @Request() req) {
    return this.authService.login(req.user);
  }
}
