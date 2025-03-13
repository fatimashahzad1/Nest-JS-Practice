import {
  IsDateString,
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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(POST_TYPE_NUMBER)
  type: POST_TYPE_NUMBER;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  postImage: string;

  @IsOptional()
  @IsDateString({}, { message: 'Event date must be a valid date.' })
  @IsNotEmpty({ message: 'Event date is required.' })
  eventDate: string;

  @IsOptional()
  @IsString({ message: 'Event time must be a valid date.' })
  @IsNotEmpty({ message: 'Event time is required.' })
  eventTime: string;
}
