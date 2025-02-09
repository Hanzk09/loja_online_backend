import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { User } from '../models/entities/user.entity';

export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findMany(take: number, skip: number): Promise<User[]>;
  findById(id: number): Promise<User> | null;
  findByEmailAndIdNotIn(email: string, id: number): Promise<User> | null;
  findByEmail(email: string): Promise<User> | null;
  update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  remove(id: number): Promise<User>;
}
