import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseIntPipe, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiParam, ApiQuery,
} from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, RoomStatus } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'ดูห้องทั้งหมด (รองรับ filter)' })
  @ApiQuery({ name: 'status', enum: RoomStatus, required: false, description: 'กรองตามสถานะ' })
  @ApiQuery({ name: 'capacity', required: false, type: Number, description: 'ความจุขั้นต่ำ' })
  @ApiQuery({ name: 'floor', required: false, type: Number, description: 'ชั้น' })
  findAll(
    @Query('status') status?: string,
    @Query('capacity') capacity?: number,
    @Query('floor') floor?: number,
  ) {
    return this.roomsService.findAll(
      status, 
      capacity ? Number(capacity) : undefined,
      floor ? Number(floor) : undefined,
    );
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'ดูห้องตามสถานะห้อง' })
  @ApiParam({ name: 'status', enum: RoomStatus, description: 'สถานะของห้อง', example: 'available' })
  findByStatus(@Param('status') status: string) {
    return this.roomsService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดูห้องตาม ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'สร้างห้องใหม่' })
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขห้อง' })
  @ApiParam({ name: 'id', example: 1 })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ลบห้อง' })
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }
}
