import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CateringService } from './catering.service';
import { CreateCateringDto } from './dto/create-catering.dto';
import { UpdateCateringDto } from './dto/update-catering.dto';

@ApiTags('catering')
@Controller('catering')
export class CateringController {
  constructor(private readonly cateringService: CateringService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลรายการอาหารจัดเลี้ยงทั้งหมด' })
  findAll() {
    return this.cateringService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลรายการอาหารจัดเลี้ยงตาม ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cateringService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'สร้างรายการอาหารจัดเลี้ยงใหม่' })
  create(@Body() createCateringDto: CreateCateringDto) {
    return this.cateringService.create(createCateringDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัปเดตข้อมูลรายการอาหารจัดเลี้ยง' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCateringDto: UpdateCateringDto
  ) {
    return this.cateringService.update(id, updateCateringDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบรายการอาหารจัดเลี้ยง' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cateringService.remove(id);
  }
}
