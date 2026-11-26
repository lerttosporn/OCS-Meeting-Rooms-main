import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { CreateToolMaintenanceDto } from './dto/create-tool-maintenance.dto';
import { UpdateToolMaintenanceDto } from './dto/update-tool-maintenance.dto';

@Injectable()
export class ToolMaintenanceService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  async findAll() {
    return await this.sql`
      SELECT * FROM tool_maintenance
      ORDER BY created_at DESC
    `;
  }

  async findOne(id: number) {
    const [maint] = await this.sql`
      SELECT * FROM tool_maintenance WHERE maint_id = ${id}
    `;
    if (!maint) throw new NotFoundException(`ไม่พบ maintenance id ${id}`);
    return maint;
  }

  async create(dto: CreateToolMaintenanceDto) {
    const [maint] = await this.sql`
      INSERT INTO tool_maintenance (
        tool_id, staff_id, status, report_details, resolved_at
      ) VALUES (
        ${dto.tool_id}, ${dto.staff_id}, ${dto.status}::status_t,
        ${dto.report_details || null}, ${dto.resolved_at || null}
      )
      RETURNING *
    `;
    return maint;
  }

  async update(id: number, dto: UpdateToolMaintenanceDto) {
    await this.findOne(id);
    const { status, ...rest } = dto;
    const updateData: Record<string, any> = { ...rest };
    if (status) updateData.status = this.sql`${status}::status_t`;

    if (Object.keys(updateData).length === 0) return this.findOne(id);

    const [updated] = await this.sql`
      UPDATE tool_maintenance
      SET ${this.sql(updateData)}
      WHERE maint_id = ${id}
      RETURNING *
    `;
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sql`
      DELETE FROM tool_maintenance WHERE maint_id = ${id}
    `;
    return { message: `ลบ maintenance id ${id} สำเร็จ` };
  }
}
