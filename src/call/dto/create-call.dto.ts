import { IsEnum, IsNumber, IsString } from 'class-validator';
import { CALL_STATUS } from 'src/constants/index';

export class CreateCallDto {
  @IsNumber()
  initiatorId: number;

  @IsString()
  receiverId: number;

  @IsEnum(CALL_STATUS)
  status: CALL_STATUS;
}
