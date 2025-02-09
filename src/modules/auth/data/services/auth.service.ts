import { Inject, Injectable } from '@nestjs/common';
import * as bycrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../user/domain/models/entities/user.entity';
import { IUserService } from '../../../user/domain/services/user.service.interface';
import { LoginResponsePayload } from '../../domain/models/login.response.payload';
import { IAuthService } from '../../domain/services/auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> | null {
    const user: User = await this.userService.findByEmail(email);
    if (user && (await bycrypt.compareSync(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<LoginResponsePayload> {
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
