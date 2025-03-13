import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @MinLength(20, { message: 'Title must be at least 20 characters long.' })
  @MaxLength(255, { message: 'Title must have less than 255 characters.' })
  title: string;

  @IsString()
  @MinLength(500, {
    message: 'Description must be at least 500 characters long.',
  })
  @MaxLength(1000, {
    message: 'Description must have less than 1000 characters.',
  })
  description: string;

  @IsString({ message: 'Estimated time must be a valid date.' })
  @IsNotEmpty({ message: 'Estimated time is required.' })
  estimatedTime: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  articleImage: string;
}
