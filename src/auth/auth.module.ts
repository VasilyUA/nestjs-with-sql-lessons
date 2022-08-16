import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strateges/local.strategy';
import { JwtStrategy } from './strateges/jwt.strategy';
import configuration from '../config';
import { jwtConfig } from './jwt.seting';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [configuration, forwardRef(() => UsersModule), PassportModule, JwtModule.register(jwtConfig)],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
