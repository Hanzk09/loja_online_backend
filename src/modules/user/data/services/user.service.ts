import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../../domain/models/dto/create-user.dto';
import { UpdateUserDto } from '../../domain/models/dto/update-user.dto';
import { User } from '../../domain/models/entities/user.entity';
import * as bycrypt from 'bcrypt';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { IUserService } from '../../domain/services/user.service.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userExists: User = await this.userRepository.findByEmail(
        createUserDto.email,
      );

      if (userExists) {
        throw new BadRequestException('E-mail já cadastrado');
      }
      createUserDto.password = await bycrypt.hash(
        createUserDto.password,
        Number(process.env.BYCRYPT_SALT),
      );

      const newUser: User = await this.userRepository.create(createUserDto);

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
      return await this.userRepository.findMany(take, skip);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
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
      const user = await this.userRepository.findByEmail(email);
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
        this.userRepository.findById(id),
        this.userRepository.findByEmailAndIdNotIn(updateUserDto.email, id),
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

      return await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const userExists = await this.userRepository.findById(id);

      if (!userExists) {
        throw new NotFoundException('Usuário não encontrado!');
      }

      return await this.userRepository.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
