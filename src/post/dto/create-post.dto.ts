import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { POST_TYPE_NUMBER } from 'src/constants/index';

export class CreatePostDto {
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(POST_TYPE_NUMBER)
  type: POST_TYPE_NUMBER;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  postImage: string;
}
