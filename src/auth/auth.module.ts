/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'TR4N$4CT10N',
      signOptions: { expiresIn: '15m' },
    }),
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UserService, JwtAuthGuard],
})
export class AuthModule {}
