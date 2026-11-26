import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  async findAll() {
    return await this.sql`SELECT * FROM organizations ORDER BY org_id`;
  }

  async findOne(id: number) {
    const [org] = await this.sql`
      SELECT * FROM organizations WHERE org_id = ${id}
    `;
    if (!org) throw new NotFoundException(`ไม่พบองค์กร id ${id}`);
    return org;
  }

  async create(dto: CreateOrganizationDto) {
    const [org] = await this.sql`
      INSERT INTO organizations (org_name, org_type, org_code, address)
      VALUES (${dto.org_name}, ${dto.org_type}::org_type_t, ${dto.org_code}, ${dto.address})
      RETURNING *
    `;
    return org;
  }

  async update(id: number, dto: UpdateOrganizationDto) {
    await this.findOne(id); // ตรวจสอบว่ามีอยู่จริง
    const [org] = await this.sql`
      UPDATE organizations
      SET ${this.sql(dto as Record<string, unknown>)}
      WHERE org_id = ${id}
      RETURNING *
    `;
    return org;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sql`DELETE FROM organizations WHERE org_id = ${id}`;
    return { message: `ลบองค์กร id ${id} สำเร็จ` };
  }
}
