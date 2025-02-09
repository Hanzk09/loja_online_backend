import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { IAuthService } from '../../domain/services/auth.service.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('IAuthService') private readonly authService: IAuthService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(emai: string, password: string) {
    const user = await this.authService.validateUser(emai, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
