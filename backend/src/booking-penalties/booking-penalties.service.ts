import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { CreateBookingPenaltyDto } from './dto/create-booking-penalty.dto';
import { UpdateBookingPenaltyDto } from './dto/update-booking-penalty.dto';

@Injectable()
export class BookingPenaltiesService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  async findAll() {
    return await this.sql`
      SELECT * FROM booking_penalties
      ORDER BY penalty_id DESC
    `;
  }

  async findOne(id: number) {
    const [penalty] = await this.sql`
      SELECT * FROM booking_penalties WHERE penalty_id = ${id}
    `;
    if (!penalty) throw new NotFoundException(`ไม่พบ penalty id ${id}`);
    return penalty;
  }

  async create(dto: CreateBookingPenaltyDto) {
    const [penalty] = await this.sql`
      INSERT INTO booking_penalties (
        booking_detail_id, tool_id, description, quantity, total_amount
      ) VALUES (
        ${dto.booking_detail_id}, ${dto.tool_id || null}, ${dto.description},
        ${dto.quantity || 1}, ${dto.total_amount}
      )
      RETURNING *
    `;
    return penalty;
  }

  async update(id: number, dto: UpdateBookingPenaltyDto) {
    await this.findOne(id);
    const updateData: Record<string, any> = { ...dto };
    if (Object.keys(updateData).length === 0) return this.findOne(id);

    const [updated] = await this.sql`
      UPDATE booking_penalties
      SET ${this.sql(updateData)}
      WHERE penalty_id = ${id}
      RETURNING *
    `;
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sql`
      DELETE FROM booking_penalties WHERE penalty_id = ${id}
    `;
    return { message: `ลบ penalty id ${id} สำเร็จ` };
  }
}
