import { Injectable } from '@nestjs/common';
import * as bycrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user: User = await this.userService.findByEmail(email);
    if (user && (await bycrypt.compareSync(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const { id, email, phone, name } = user;
    const payload = { id, email, phone, name };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '40d',
        secret: process.env.REFRESH_JWT_SECRET,
      }),
    };
  }
}
