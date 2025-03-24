import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserType } from 'src/constants';

export class CreateUserDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Name must have more than 3 characters' })
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'First Name must have more than 3 characters' })
  firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Last Name must have more than 3 characters' })
  lastName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  profession: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  address: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  country: string;

  @IsNumber()
  bankNo: number;

  @IsBoolean()
  acceptTerms: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified: boolean;

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // links?: Prisma.JsonValue;

  @IsOptional()
  @IsString()
  pictureUrl: string;

  @IsOptional()
  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  companyWebsite: string;

  @IsOptional()
  @IsNumber()
  companySize: number;

  @IsEnum(UserType, { message: 'userType must be a valid UserType value' })
  userType: UserType;
}
