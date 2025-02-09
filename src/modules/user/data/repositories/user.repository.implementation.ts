import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../../domain/models/dto/create-user.dto';
import { UpdateUserDto } from '../../domain/models/dto/update-user.dto';
import { User } from '../../domain/models/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(readonly prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.prismaService.user.create({ data: createUserDto });
  }
  async findMany(take: number, skip: number): Promise<User[]> {
    return await this.prismaService.user.findMany({ take: take, skip: skip });
  }
  async findById(id: number): Promise<User> | null {
    return await this.prismaService.user.findUnique({ where: { id: id } });
  }

  async findByEmailAndIdNotIn(email: string, id: number): Promise<User> | null {
    return await this.prismaService.user.findUnique({
      where: { email: email, AND: { id: { not: id } } },
    });
  }

  async findByEmail(email: string): Promise<User> | null {
    return await this.prismaService.user.findUnique({
      where: { email: email },
    });
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.prismaService.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }
  async remove(id: number): Promise<User> {
    return await this.prismaService.user.delete({ where: { id: id } });
  }
}
