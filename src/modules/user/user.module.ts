import { Module } from '@nestjs/common';
import { UserService } from './data/services/user.service';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { UserController } from './data/controllers/user.controller';
import { UserRepository } from './data/repositories/user.repository.implementation';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    { provide: 'IUserService', useClass: UserService },
    { provide: 'IUserRepository', useClass: UserRepository },
  ],
  exports: ['IUserService'],
})
export class UserModule {}
