import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';

@Injectable()
export class RoomTypesService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  async findAll() {
    return await this.sql`SELECT * FROM room_type ORDER BY room_type_id`;
  }

  async findOne(id: number) {
    const [rt] = await this.sql`
      SELECT * FROM room_type WHERE room_type_id = ${id}
    `;
    if (!rt) throw new NotFoundException(`ไม่พบประเภทห้อง id ${id}`);
    return rt;
  }

  async create(dto: CreateRoomTypeDto) {
    const [rt] = await this.sql`
      INSERT INTO room_type (name, description)
      VALUES (${dto.name}, ${dto.description ?? null})
      RETURNING *
    `;
    return rt;
  }

  async update(id: number, dto: Partial<CreateRoomTypeDto>) {
    await this.findOne(id);
    const [rt] = await this.sql`
      UPDATE room_type
      SET ${this.sql(dto as Record<string, unknown>)}
      WHERE room_type_id = ${id}
      RETURNING *
    `;
    return rt;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sql`DELETE FROM room_type WHERE room_type_id = ${id}`;
    return { message: `ลบประเภทห้อง id ${id} สำเร็จ` };
  }
}
