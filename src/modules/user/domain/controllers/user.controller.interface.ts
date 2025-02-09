import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { User } from '../models/entities/user.entity';

export interface IUserController {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(take: number, skip: number): Promise<User[]>;
  findOne(id: number): Promise<User>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  remove(id: number): Promise<User>;
}
