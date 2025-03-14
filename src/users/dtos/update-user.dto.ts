import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Ensures each element is validated
  @Type(() => LinkDTO) // Helps class-transformer properly handle objects
  links?: LinkDTO[];
}

// Define a DTO for links
export class LinkDTO {
  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
