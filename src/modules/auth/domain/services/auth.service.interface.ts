import { User } from 'src/modules/user/domain/models/entities/user.entity';
import { LoginResponsePayload } from '../models/login.response.payload';

export interface IAuthService {
  validateUser(email: string, password: string): Promise<User> | null;
  login(user: User): Promise<LoginResponsePayload>;
}
