import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { CreateRoomRateDto } from './dto/create-room-rate.dto';
import { UpdateRoomRateDto } from './dto/update-room-rate.dto';

@Injectable()
export class RoomRatesService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  async findAll() {
    return await this.sql`
      SELECT * FROM room_rate
      ORDER BY room_id, rate_name
    `;
  }

  async findOne(id: number) {
    const [rate] = await this.sql`
      SELECT * FROM room_rate
      WHERE room_rate_id = ${id}
    `;
    if (!rate) throw new NotFoundException(`ไม่พบ room rate id ${id}`);
    return rate;
  }

  async findByRoom(roomId: number) {
    return await this.sql`
      SELECT * FROM room_rate
      WHERE room_id = ${roomId}
      ORDER BY rate_name
    `;
  }

  async create(dto: CreateRoomRateDto) {
    const [rate] = await this.sql`
      INSERT INTO room_rate (room_id, rate_name, start_time, end_time, price)
      VALUES (${dto.room_id}, ${dto.rate_name}, ${dto.start_time}, ${dto.end_time}, ${dto.price})
      RETURNING *
    `;
    return rate;
  }

  async update(id: number, dto: UpdateRoomRateDto) {
    await this.findOne(id);
    const updateData: Record<string, any> = { ...dto };
    if (Object.keys(updateData).length === 0) return this.findOne(id);

    const [rate] = await this.sql`
      UPDATE room_rate
      SET ${this.sql(updateData)}
      WHERE room_rate_id = ${id}
      RETURNING *
    `;
    return rate;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sql`
      DELETE FROM room_rate
      WHERE room_rate_id = ${id}
    `;
    return { message: `ลบ room rate id ${id} สำเร็จ` };
  }
}
