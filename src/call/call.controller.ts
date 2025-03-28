import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
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
      req.callType,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserCalls(
    @Request() req,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    return this.callService.getUserCalls(req.user.id, page, perPage);
  }
}
