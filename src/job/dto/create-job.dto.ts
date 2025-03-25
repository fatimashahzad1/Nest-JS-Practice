import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  hourlyRate: number;
}
