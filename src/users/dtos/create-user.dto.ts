import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Name must have more than 3 characters' })
  name: string;

  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  gender?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  isMarried?: boolean;
}
