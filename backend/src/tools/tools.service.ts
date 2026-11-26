import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';

@Injectable()
export class ToolsService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  async findAll() {
    return await this.sql`
      SELECT * FROM tools
      ORDER BY tool_id
    `;
  }

  async findOne(id: number) {
    const [tool] = await this.sql`
      SELECT * FROM tools WHERE tool_id = ${id}
    `;
    if (!tool) throw new NotFoundException(`ไม่พบ tool id ${id}`);
    return tool;
  }

  async create(dto: CreateToolDto) {
    const [tool] = await this.sql`
      INSERT INTO tools (name, description, unit_price, stock)
      VALUES (${dto.name}, ${dto.description || null}, ${dto.unit_price || 0}, ${dto.stock || 0})
      RETURNING *
    `;
    return tool;
  }

  async update(id: number, dto: UpdateToolDto) {
    await this.findOne(id);
    const updateData: Record<string, any> = { ...dto };
    if (Object.keys(updateData).length === 0) return this.findOne(id);

    const [updated] = await this.sql`
      UPDATE tools
      SET ${this.sql(updateData)}
      WHERE tool_id = ${id}
      RETURNING *
    `;
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sql`
      DELETE FROM tools WHERE tool_id = ${id}
    `;
    return { message: `ลบ tool id ${id} สำเร็จ` };
  }
}
