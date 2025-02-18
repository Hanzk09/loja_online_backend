import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @IsPhoneNumber()
  phone: string;
  @IsString()
  password: string;
  @IsDateString()
  @IsOptional()
  lock?: string;
}
