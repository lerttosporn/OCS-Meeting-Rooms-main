import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingPenaltiesService } from './booking-penalties.service';
import { CreateBookingPenaltyDto } from './dto/create-booking-penalty.dto';
import { UpdateBookingPenaltyDto } from './dto/update-booking-penalty.dto';

@ApiTags('booking-penalties')
@Controller('booking-penalties')
export class BookingPenaltiesController {
  constructor(private readonly bookingPenaltiesService: BookingPenaltiesService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลค่าปรับทั้งหมด' })
  findAll() {
    return this.bookingPenaltiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลค่าปรับตาม ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingPenaltiesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'บันทึกค่าปรับใหม่' })
  create(@Body() createBookingPenaltyDto: CreateBookingPenaltyDto) {
    return this.bookingPenaltiesService.create(createBookingPenaltyDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัปเดตข้อมูลค่าปรับ' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingPenaltyDto: UpdateBookingPenaltyDto
  ) {
    return this.bookingPenaltiesService.update(id, updateBookingPenaltyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบข้อมูลค่าปรับ' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingPenaltiesService.remove(id);
  }
}
