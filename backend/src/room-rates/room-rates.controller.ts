import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RoomRatesService } from './room-rates.service';
import { CreateRoomRateDto } from './dto/create-room-rate.dto';
import { UpdateRoomRateDto } from './dto/update-room-rate.dto';

@ApiTags('room-rates')
@Controller('room-rates')
export class RoomRatesController {
  constructor(private readonly roomRatesService: RoomRatesService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลเรทราคาห้องทั้งหมด' })
  findAll() {
    return this.roomRatesService.findAll();
  }

  @Get('room/:roomId')
  @ApiOperation({ summary: 'ดึงข้อมูลเรทราคาของห้องตาม room_id' })
  @ApiParam({ name: 'roomId', type: 'number' })
  findByRoom(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.roomRatesService.findByRoom(roomId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลเรทราคาตาม ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomRatesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'สร้างเรทราคาใหม่' })
  create(@Body() createRoomRateDto: CreateRoomRateDto) {
    return this.roomRatesService.create(createRoomRateDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัปเดตข้อมูลเรทราคา' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomRateDto: UpdateRoomRateDto,
  ) {
    return this.roomRatesService.update(id, updateRoomRateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบเรทราคา' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomRatesService.remove(id);
  }
}
