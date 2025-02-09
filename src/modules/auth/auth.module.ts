import { Module } from '@nestjs/common';
import { AuthService } from './data/services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './data/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './data/strategies/jwt-refresh.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './data/controllers/auth.controller';
import { LocalStrategy } from './data/strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: 'IAuthService', useClass: AuthService },
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
