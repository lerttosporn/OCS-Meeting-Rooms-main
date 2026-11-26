import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';

export class CheckoutDto {
  staff_id: number;
  notes?: string;
}

@Injectable()
export class CartsService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  // Helper to ensure a cart exists for a user and return its ID
  async ensureCartExists(userId: number): Promise<{ cart_id: number }> {
    const [cart] = await this.sql`
      SELECT cart_id FROM cart WHERE user_id = ${userId}
    `;
    if (cart) return { cart_id: cart.cart_id };

    const [newCart] = await this.sql`
      INSERT INTO cart (user_id) VALUES (${userId}) RETURNING cart_id
    `;
    return { cart_id: newCart.cart_id };
  }

  async getCart(userId: number) {
    const [cart] = await this.sql`
      SELECT * FROM cart WHERE user_id = ${userId}
    `;
    if (!cart) return { items: [] };

    const items = await this.sql`
      SELECT ci.*, r.room_name, rr.rate_name, rr.price
      FROM cart_item ci
      JOIN room r ON ci.room_id = r.room_id
      JOIN room_rate rr ON ci.room_rate_id = rr.room_rate_id
      WHERE ci.cart_id = ${cart.cart_id}
      ORDER BY ci.cart_item_id
    `;
    return { ...cart, items };
  }

  async clearCart(userId: number) {
    const [cart] = await this.sql`SELECT cart_id FROM cart WHERE user_id = ${userId}`;
    if (cart) {
      await this.sql`DELETE FROM cart_item WHERE cart_id = ${cart.cart_id}`;
      await this.sql`DELETE FROM cart WHERE cart_id = ${cart.cart_id}`;
    }
    return { message: `ลบตระกร้าของ user ${userId} สำเร็จ` };
  }

  async checkout(userId: number, dto: CheckoutDto) {
    // 1. ดึง cart ของ user
    const [cart] = await this.sql`
      SELECT cart_id FROM cart WHERE user_id = ${userId}
    `;
    if (!cart) throw new NotFoundException(`ไม่พบตระกร้าของ user ${userId}`);

    // 2. ดึง cart items พร้อมราคาจาก room_rate
    const items = await this.sql`
      SELECT ci.*, rr.price
      FROM cart_item ci
      JOIN room_rate rr ON ci.room_rate_id = rr.room_rate_id
      WHERE ci.cart_id = ${cart.cart_id}
      ORDER BY ci.cart_item_id
    `;
    if (items.length === 0) throw new BadRequestException(`ตระกร้าว่างเปล่า ไม่สามารถ checkout ได้`);

    // 3. คำนวณ total_amount จากราคาทุกห้อง
    const totalAmount = items.reduce((sum: number, item: any) => sum + parseFloat(item.price), 0);

    // 4. สร้าง booking + booking_details ใน transaction เดียว แล้วล้าง cart
    return await this.sql.begin(async (tx) => {
      // สร้าง booking หลัก
      const [booking] = await tx`
        INSERT INTO booking
          (customer_id, staff_id, total_amount, discount_amount,
           booking_status, payment_status, notes)
        VALUES
          (${userId}, ${dto.staff_id}, ${totalAmount}, 0,
           'draft'::booking_status_t, 'unpaid'::payment_status_t, ${dto.notes ?? null})
        RETURNING *
      `;

      // สร้าง booking_detail ทุกรายการจาก cart items
      const details = await Promise.all(
        items.map((item: any) =>
          tx`
            INSERT INTO booking_detail
              (booking_id, room_id, start_date, end_date,
               start_time, end_time, price_snapshot)
            VALUES
              (${booking.booking_id}, ${item.room_id},
               ${item.start_date}, ${item.end_date},
               ${item.start_time}, ${item.end_time}, ${item.price})
            RETURNING *
          `.then((rows) => rows[0]),
        ),
      );

      // ล้าง cart หลัง checkout สำเร็จ
      await tx`DELETE FROM cart_item WHERE cart_id = ${cart.cart_id}`;
      await tx`DELETE FROM cart WHERE cart_id = ${cart.cart_id}`;

      return {
        message: 'Checkout สำเร็จ',
        booking_id: booking.booking_id,
        total_amount: totalAmount,
        room_count: details.length,
        booking: { ...booking, details },
      };
    });
  }
}

