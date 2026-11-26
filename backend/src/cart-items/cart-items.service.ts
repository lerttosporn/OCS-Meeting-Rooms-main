import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  async findAll() {
    return await this.sql`
      SELECT ci.*, r.room_name, rr.rate_name, rr.price 
      FROM cart_item ci
      JOIN room r ON ci.room_id = r.room_id
      JOIN room_rate rr ON ci.room_rate_id = rr.room_rate_id
      ORDER BY ci.cart_item_id
    `;
  }

  async findOne(id: number) {
    const [item] = await this.sql`
      SELECT ci.*, r.room_name, rr.rate_name, rr.price 
      FROM cart_item ci
      JOIN room r ON ci.room_id = r.room_id
      JOIN room_rate rr ON ci.room_rate_id = rr.room_rate_id
      WHERE ci.cart_item_id = ${id}
    `;
    if (!item) throw new NotFoundException(`ไม่พบ cart item id ${id}`);
    return item;
  }

  async create(dto: CreateCartItemDto) {
    const [item] = await this.sql`
      INSERT INTO cart_item (
        cart_id, room_id, room_rate_id, start_date, end_date, start_time, end_time
      ) VALUES (
        ${dto.cart_id}, ${dto.room_id}, ${dto.room_rate_id}, 
        ${dto.start_date}, ${dto.end_date}, ${dto.start_time || null}, ${dto.end_time || null}
      )
      RETURNING *
    `;
    return item;
  }

  async update(id: number, dto: UpdateCartItemDto) {
    await this.findOne(id);
    const updateData: Record<string, any> = { ...dto };
    if (Object.keys(updateData).length === 0) return this.findOne(id);

    const [updated] = await this.sql`
      UPDATE cart_item
      SET ${this.sql(updateData)}
      WHERE cart_item_id = ${id}
      RETURNING *
    `;
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sql`
      DELETE FROM cart_item WHERE cart_item_id = ${id}
    `;
    return { message: `ลบ cart item id ${id} สำเร็จ` };
  }
}
