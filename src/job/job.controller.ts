import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Job } from '@prisma/client';
import { CreateJobDto } from './dto/create-job.dto';
import { JobService } from './job.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobController {
  constructor(private readonly jobsService: JobService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto, @Req() req): Promise<Job> {
    return this.jobsService.create(createJobDto, req.user.id);
  }

  @Get() findAll(): Promise<Job[]> {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Job> {
    return this.jobsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobDto: Partial<CreateJobDto>,
  ): Promise<Job> {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.jobsService.remove(id);
  }
}
