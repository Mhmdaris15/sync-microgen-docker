/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<any> {
    const accessToken = this.jwtService.sign({ sub: user.id });
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async register(user: User): Promise<any> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = { ...user, password: hashedPassword };
    const registeredUser = this.userService.createUser(newUser);
    // if user is not created, return error server response
    if (!registeredUser) {
      return {
        error: 'User already exists',
      };
    }
    return this.login(newUser);
  }

  async generateRefreshToken(user: any): Promise<string> {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: '30d' }); // Adjust expiration as needed
  }

  async generateAccessToken(user: any): Promise<string> {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: '15m' }); // Adjust expiration as needed
  }
}
