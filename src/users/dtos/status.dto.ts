import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class StatusDTO {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isMarried: boolean;
}
