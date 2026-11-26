import {
  Controller, Get, Post, Body, Param, Delete, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CartsService, CheckoutDto } from './carts.service';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'ดึงข้อมูลตระกร้าสินค้าของ User' })
  getCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartsService.getCart(userId);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'สร้างตระกร้าเปล่าสำหรับ User (ถ้ายังไม่มี)' })
  createCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartsService.ensureCartExists(userId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'ล้างตระกร้าทั้งหมดของ User' })
  clearCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartsService.clearCart(userId);
  }

  @Post(':userId/checkout')
  @ApiOperation({
    summary: 'Checkout — แปลงทุกรายการในตระกร้าเป็น 1 Booking (พร้อม booking_details ทุกห้อง)',
    description: 'สร้าง booking + booking_details ใน transaction เดียว แล้วล้าง cart อัตโนมัติ'
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['staff_id'],
      properties: {
        staff_id: { type: 'number', example: 2, description: 'ID ของ staff ที่ดูแลการจอง' },
        notes: { type: 'string', example: 'ต้องการโปรเจกเตอร์เพิ่ม', description: 'หมายเหตุ (optional)' },
      },
    },
  })
  checkout(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CheckoutDto,
  ) {
    return this.cartsService.checkout(userId, dto);
  }
}
