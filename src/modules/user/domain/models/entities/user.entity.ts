import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class User {
  @IsNumber()
  id: number;
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsString()
  phone: string;
  @IsString()
  password: string;
  @IsDate()
  @IsOptional()
  lock?: Date;
  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt?: Date;
}
