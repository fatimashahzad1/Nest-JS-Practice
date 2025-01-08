import { IsEmail, IsString } from 'class-validator';

export class LoginUserDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
