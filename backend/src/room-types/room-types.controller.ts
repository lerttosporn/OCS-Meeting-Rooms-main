import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { RoomTypesService } from './room-types.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';

@ApiTags('room-types')
@Controller('room-types')
export class RoomTypesController {
  constructor(private readonly roomTypesService: RoomTypesService) {}

  @Get()
  @ApiOperation({ summary: 'ดูประเภทห้องทั้งหมด' })
  findAll() {
    return this.roomTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดูประเภทห้องตาม ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomTypesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'สร้างประเภทห้องใหม่' })
  create(@Body() dto: CreateRoomTypeDto) {
    return this.roomTypesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขประเภทห้อง' })
  @ApiParam({ name: 'id', example: 1 })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateRoomTypeDto>,
  ) {
    return this.roomTypesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ลบประเภทห้อง' })
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomTypesService.remove(id);
  }
}
