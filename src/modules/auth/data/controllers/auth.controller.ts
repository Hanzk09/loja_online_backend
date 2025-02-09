import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';
import { IAuthService } from '../../domain/services/auth.service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService') private readonly authService: IAuthService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(@Req() req) {
    return this.authService.login(req.user);
  }
}
