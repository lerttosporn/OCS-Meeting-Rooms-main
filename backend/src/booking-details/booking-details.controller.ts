import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingDetailsService } from './booking-details.service';
import { CreateBookingDetailDto } from './dto/create-booking-detail.dto';
import { UpdateBookingDetailDto } from './dto/update-booking-detail.dto';
import { AddBookingDetailToolDto } from './dto/booking-detail-tools.dto';
import { AddBookingDetailCateringDto } from './dto/booking-detail-catering.dto';
import { AddBookingNetworkDto } from './dto/booking-network.dto';

@ApiTags('booking-details')
@Controller('booking-details')
export class BookingDetailsController {
  constructor(private readonly bookingDetailsService: BookingDetailsService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูล booking details ทั้งหมด' })
  findAll() {
    return this.bookingDetailsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูล booking detail พร้อมส่วนเสริมทั้งหมด (tools, catering, network)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingDetailsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'สร้าง booking detail ใหม่' })
  create(@Body() createBookingDetailDto: CreateBookingDetailDto) {
    return this.bookingDetailsService.create(createBookingDetailDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัปเดตข้อมูล booking detail' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDetailDto: UpdateBookingDetailDto
  ) {
    return this.bookingDetailsService.update(id, updateBookingDetailDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบ booking detail' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingDetailsService.remove(id);
  }

  // ==========================================
  // TOOLS
  // ==========================================
  @Post(':id/tools')
  @ApiOperation({ summary: 'เพิ่มอุปกรณ์ให้ booking detail' })
  addTool(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddBookingDetailToolDto
  ) {
    return this.bookingDetailsService.addTool(id, dto);
  }

  @Delete(':id/tools/:toolId')
  @ApiOperation({ summary: 'ลบอุปกรณ์ออกจาก booking detail' })
  removeTool(
    @Param('id', ParseIntPipe) id: number,
    @Param('toolId', ParseIntPipe) toolId: number
  ) {
    return this.bookingDetailsService.removeTool(id, toolId);
  }

  // ==========================================
  // CATERING
  // ==========================================
  @Post(':id/catering')
  @ApiOperation({ summary: 'เพิ่มรายการอาหารจัดเลี้ยงให้ booking detail' })
  addCatering(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddBookingDetailCateringDto
  ) {
    return this.bookingDetailsService.addCatering(id, dto);
  }

  @Delete(':id/catering/:cateringId')
  @ApiOperation({ summary: 'ลบรายการอาหารจัดเลี้ยงออกจาก booking detail' })
  removeCatering(
    @Param('id', ParseIntPipe) id: number,
    @Param('cateringId', ParseIntPipe) cateringId: number
  ) {
    return this.bookingDetailsService.removeCatering(id, cateringId);
  }

  // ==========================================
  // NETWORK
  // ==========================================
  @Post(':id/network')
  @ApiOperation({ summary: 'เพิ่มแพ็กเกจเครือข่ายให้ booking detail' })
  addNetwork(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddBookingNetworkDto
  ) {
    return this.bookingDetailsService.addNetwork(id, dto);
  }

  @Delete(':id/network/:networkId')
  @ApiOperation({ summary: 'ลบแพ็กเกจเครือข่ายออกจาก booking detail' })
  removeNetwork(
    @Param('id', ParseIntPipe) id: number,
    @Param('networkId', ParseIntPipe) networkId: number
  ) {
    return this.bookingDetailsService.removeNetwork(id, networkId);
  }
}
