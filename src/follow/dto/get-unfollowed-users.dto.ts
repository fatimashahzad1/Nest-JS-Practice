import { IsInt, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetUnfollowedUsersDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Count must be an integer' })
  @Min(1, { message: 'Count must be at least 1' })
  count?: number;
}
