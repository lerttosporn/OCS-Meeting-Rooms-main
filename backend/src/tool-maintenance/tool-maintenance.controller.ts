import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ToolMaintenanceService } from './tool-maintenance.service';
import { CreateToolMaintenanceDto } from './dto/create-tool-maintenance.dto';
import { UpdateToolMaintenanceDto } from './dto/update-tool-maintenance.dto';

@ApiTags('tool-maintenance')
@Controller('tool-maintenance')
export class ToolMaintenanceController {
  constructor(private readonly toolMaintenanceService: ToolMaintenanceService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลประวัติการแจ้งซ่อมทั้งหมด' })
  findAll() {
    return this.toolMaintenanceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลแจ้งซ่อมตาม ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.toolMaintenanceService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'สร้างรายการแจ้งซ่อมใหม่' })
  create(@Body() createToolMaintenanceDto: CreateToolMaintenanceDto) {
    return this.toolMaintenanceService.create(createToolMaintenanceDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัปเดตข้อมูลแจ้งซ่อม' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateToolMaintenanceDto: UpdateToolMaintenanceDto
  ) {
    return this.toolMaintenanceService.update(id, updateToolMaintenanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบรายการแจ้งซ่อม' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.toolMaintenanceService.remove(id);
  }
}
