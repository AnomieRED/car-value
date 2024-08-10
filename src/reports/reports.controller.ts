import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {

  constructor(private reportsService: ReportsService) {
  }

  @Get()
  async getEstimate(@Query() query: GetEstimateDto) {
    return await this.reportsService.getEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async create(@Body() body: CreateReportDto, @CurrentUser() user: User): Promise<Partial<ReportDto>> {
    return await this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return await this.reportsService.changeApproval(id, body.isApproved);
  }
}
