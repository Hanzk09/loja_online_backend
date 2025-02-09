import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bycrypt from 'bcrypt';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userExists: User = await this.prismaService.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (userExists) {
        throw new BadRequestException('E-mail já cadastrado');
      }
      createUserDto.password = await bycrypt.hash(
        createUserDto.password,
        Number(process.env.BYCRYPT_SALT),
      );

      const newUser: User = await this.prismaService.user.create({
        data: createUserDto,
      });

      return newUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(take: number, skip: number): Promise<User[]> {
    try {
      return await this.prismaService.user.findMany({ take: take, skip: skip });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: id },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado!');
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado!');
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const [userById, userByEmail] = await Promise.all([
        this.prismaService.user.findUnique({ where: { id: id } }),
        this.prismaService.user.findUnique({
          where: { email: updateUserDto.email, AND: { id: { not: id } } },
        }),
      ]);
      if (!userById) {
        throw new NotFoundException('Usuário não encontrado!');
      }
      if (userByEmail) {
        throw new BadRequestException('E-mail já utilizado por outro usuário!');
      }

      if (updateUserDto.password) {
        updateUserDto.password = await bycrypt.hash(
          updateUserDto.password,
          Number(process.env.BYCRYPT_SALT),
        );
      }

      return await this.prismaService.user.update({
        where: { id: id },
        data: updateUserDto,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const userExists = await this.prismaService.user.findUnique({
        where: { id: id },
      });

      if (!userExists) {
        throw new NotFoundException('Usuário não encontrado!');
      }

      return await this.prismaService.user.delete({
        where: { id: id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
