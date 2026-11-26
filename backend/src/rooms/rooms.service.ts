import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  async findAll(status?: string, capacity?: number, floor?: number) {
    const rooms = await this.sql`
      SELECT r.*, rt.name as room_type_name
      FROM room r
      JOIN room_type rt ON r.room_type_id = rt.room_type_id
      WHERE
        (${status ? this.sql`r.room_status = ${status}::room_status_t` : this.sql`true`})
        AND (${capacity ? this.sql`r.capacity >= ${capacity}` : this.sql`true`})
        AND (${floor ? this.sql`r.floor = ${floor}` : this.sql`true`})
      ORDER BY r.floor, r.room_name
    `;

    if (rooms.length === 0) return [];

    const roomIds = rooms.map(r => r.room_id);
    const rates = await this.sql`
      SELECT * FROM room_rate
      WHERE room_id = ANY(${roomIds})
    `;

    return rooms.map(r => ({
      ...r,
      room_rates: rates.filter(rate => rate.room_id === r.room_id)
    }));
  }

  async findByStatus(status: string) {
    const rooms = await this.sql`
      SELECT r.*, rt.name as room_type_name
      FROM room r
      JOIN room_type rt ON r.room_type_id = rt.room_type_id
      WHERE r.room_status = ${status}::room_status_t
      ORDER BY r.floor, r.room_name
    `;

    if (rooms.length === 0) return [];

    const roomIds = rooms.map(r => r.room_id);
    const rates = await this.sql`
      SELECT * FROM room_rate
      WHERE room_id = ANY(${roomIds})
    `;

    return rooms.map(r => ({
      ...r,
      room_rates: rates.filter(rate => rate.room_id === r.room_id)
    }));
  }

  async findOne(id: number) {
    const [room] = await this.sql`
      SELECT r.*, rt.name as room_type_name
      FROM room r
      JOIN room_type rt ON r.room_type_id = rt.room_type_id
      WHERE r.room_id = ${id}
    `;
    if (!room) throw new NotFoundException(`ไม่พบห้อง id ${id}`);

    const rates = await this.sql`
      SELECT * FROM room_rate
      WHERE room_id = ${id}
    `;
    room.room_rates = rates;
    return room;
  }

  async create(dto: CreateRoomDto) {
    const [room] = await this.sql`
      INSERT INTO room (org_id, room_type_id, room_name, capacity, floor, room_status)
      VALUES (${dto.org_id}, ${dto.room_type_id}, ${dto.room_name},
              ${dto.capacity}, ${dto.floor}, ${dto.room_status}::room_status_t)
      RETURNING *
    `;
    return room;
  }

  async update(id: number, dto: UpdateRoomDto) {
    await this.findOne(id);
    const { room_status, ...rest } = dto;
    const updateData: Record<string, any> = { ...rest };
    
    // จัดการ enum type ให้ถูกต้อง
    if (room_status) {
      updateData.room_status = this.sql`${room_status}::room_status_t`;
    }

    const [room] = await this.sql`
      UPDATE room
      SET ${this.sql(updateData)}
      WHERE room_id = ${id}
      RETURNING *
    `;
    return room;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sql`DELETE FROM room WHERE room_id = ${id}`;
    return { message: `ลบห้อง id ${id} สำเร็จ` };
  }
}
