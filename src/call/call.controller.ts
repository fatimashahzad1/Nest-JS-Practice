import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CallService } from './call.service';
import { CreateCallDto } from './dto/create-call.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('call')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post()
  async createCall(
    @Body()
    req: CreateCallDto,
  ) {
    return this.callService.createCall(
      req.initiatorId,
      req.receiverId,
      req.status,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserCalls(@Request() req) {
    return this.callService.getUserCalls(req.user.id);
  }
}
