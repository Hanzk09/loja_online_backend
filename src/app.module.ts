import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './modules/auth/data/guards/auth.guard';
import { TransformInterceptor } from './shared/interceptors/transform/transform.interceptor';
import { HttpExceptionFilter } from './shared/filters/http-exception/http-exception.filter';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
