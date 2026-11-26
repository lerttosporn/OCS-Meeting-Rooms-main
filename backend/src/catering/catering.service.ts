import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { CreateCateringDto } from './dto/create-catering.dto';
import { UpdateCateringDto } from './dto/update-catering.dto';

@Injectable()
export class CateringService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  async findAll() {
    return await this.sql`
      SELECT * FROM catering
      ORDER BY catering_id
    `;
  }

  async findOne(id: number) {
    const [item] = await this.sql`
      SELECT * FROM catering WHERE catering_id = ${id}
    `;
    if (!item) throw new NotFoundException(`ไม่พบ catering id ${id}`);
    return item;
  }

  async create(dto: CreateCateringDto) {
    const [item] = await this.sql`
      INSERT INTO catering (name, description)
      VALUES (${dto.name}, ${dto.description || null})
      RETURNING *
    `;
    return item;
  }

  async update(id: number, dto: UpdateCateringDto) {
    await this.findOne(id);
    const updateData: Record<string, any> = { ...dto };
    if (Object.keys(updateData).length === 0) return this.findOne(id);

    const [updated] = await this.sql`
      UPDATE catering
      SET ${this.sql(updateData)}
      WHERE catering_id = ${id}
      RETURNING *
    `;
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sql`
      DELETE FROM catering WHERE catering_id = ${id}
    `;
    return { message: `ลบ catering id ${id} สำเร็จ` };
  }
}
