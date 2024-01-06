/* eslint-disable prettier/prettier */
import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    const tokens = await this.authService.login(req.user);
    return tokens;
  }

  @Post('register')
  async register(@Request() req) {
    return this.authService.register(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req: any): Promise<any> {
    const user = req.user;
    const newAccessToken = this.authService.generateAccessToken(user);
    const newRefreshToken = await this.authService.generateRefreshToken(user);
    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
