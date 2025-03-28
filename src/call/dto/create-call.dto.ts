import { IsEnum, IsNumber, IsString } from 'class-validator';
import { CALL_STATUS, CALL_TYPE } from 'src/constants/index';

export class CreateCallDto {
  @IsNumber()
  initiatorId: number;

  @IsString()
  receiverId: number;

  @IsEnum(CALL_STATUS)
  status: CALL_STATUS;

  @IsEnum(CALL_TYPE)
  callType: CALL_TYPE;
}
