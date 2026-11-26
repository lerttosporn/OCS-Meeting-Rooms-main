import {
  Controller, Get, Post, Body, Patch,
  Param, ParseIntPipe, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  UpdateBookingStatusDto,
} from './dto/create-booking.dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'ดู booking ทั้งหมด' })
  @ApiQuery({ name: 'status', required: false, description: 'กรองตามสถานะ' })
  findAll(@Query('status') status?: string) {
    return this.bookingsService.findAll(status);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'ดู booking ตามสถานะ' })
  @ApiParam({ name: 'status', example: 'confirmed' })
  findByStatus(@Param('status') status: string) {
    return this.bookingsService.findAll(status);
  }

  @Get('month/:yearMonth')
  @ApiOperation({ summary: 'ดู booking ของเดือนที่ระบุ' })
  @ApiParam({ name: 'yearMonth', example: '2026-05' })
  @ApiQuery({ name: 'status', required: false, description: 'กรองตามสถานะ' })
  findAllMonthlyBookings(
    @Param('yearMonth') yearMonth: string,
    @Query('status') status?: string,
  ) {
    return this.bookingsService.findAllMonthlyBookings(yearMonth, status);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'ดู bookings ทั้งหมดของ user พร้อม room details (กรองตามสถานะได้)' })
  @ApiParam({ name: 'userId', example: 1 })
  @ApiQuery({ name: 'status', required: false, description: 'กรองตามสถานะ' })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('status') status?: string,
  ) {
    return this.bookingsService.findByUser(userId, status);
  }

  @Get('user/:userId/status/:status')
  @ApiOperation({ summary: 'ดู bookings ทั้งหมดของ user ตามสถานะ พร้อม room details' })
  @ApiParam({ name: 'userId', example: 1 })
  @ApiParam({ name: 'status', example: 'confirmed' })
  findByUserAndStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('status') status: string,
  ) {
    return this.bookingsService.findByUser(userId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดู booking ตาม ID พร้อม details' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'สร้าง booking ใหม่ (รวม booking details)' })
  @ApiResponse({ status: 201, description: 'สร้างสำเร็จ พร้อม details' })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'อัพเดตสถานะ booking' })
  @ApiParam({ name: 'id', example: 1 })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, dto);
  }
}
