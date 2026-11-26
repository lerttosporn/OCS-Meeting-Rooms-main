import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลรายการในตระกร้าทั้งหมด' })
  findAll() {
    return this.cartItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลรายการตระกร้าตาม ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'เพิ่มรายการลงตระกร้า (แยก)' })
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemsService.create(createCartItemDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัปเดตข้อมูลรายการในตระกร้า' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    return this.cartItemsService.update(id, updateCartItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบรายการออกจากตระกร้า' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemsService.remove(id);
  }
}
