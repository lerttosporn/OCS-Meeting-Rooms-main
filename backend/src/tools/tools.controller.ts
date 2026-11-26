import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';

@ApiTags('tools')
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลอุปกรณ์ทั้งหมด' })
  findAll() {
    return this.toolsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลอุปกรณ์ตาม ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.toolsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'สร้างอุปกรณ์ใหม่' })
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolsService.create(createToolDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัปเดตข้อมูลอุปกรณ์' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateToolDto: UpdateToolDto
  ) {
    return this.toolsService.update(id, updateToolDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบอุปกรณ์' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.toolsService.remove(id);
  }
}
