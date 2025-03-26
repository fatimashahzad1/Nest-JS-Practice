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
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';

import { Job } from '@prisma/client';
import { CreateJobDto } from './dto/create-job.dto';
import { JobService } from './job.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CompanyAuthGuard } from 'src/guards/company-auth-guard';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobController {
  constructor(private readonly jobsService: JobService) {}

  @UseGuards(CompanyAuthGuard)
  @Post()
  create(@Body() createJobDto: CreateJobDto, @Req() req): Promise<Job> {
    return this.jobsService.create(createJobDto, req.user.id);
  }

  @Get('all')
  async getAllJobs(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ): Promise<Partial<Job>[]> {
    return this.jobsService.findAllWithPagination(page, perPage);
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
