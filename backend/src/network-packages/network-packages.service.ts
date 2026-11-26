import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { CreateNetworkPackageDto } from './dto/create-network-package.dto';
import { UpdateNetworkPackageDto } from './dto/update-network-package.dto';

@Injectable()
export class NetworkPackagesService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  async findAll() {
    return await this.sql`
      SELECT * FROM network_packages
      ORDER BY package_id
    `;
  }

  async findOne(id: number) {
    const [pkg] = await this.sql`
      SELECT * FROM network_packages WHERE package_id = ${id}
    `;
    if (!pkg) throw new NotFoundException(`ไม่พบ package id ${id}`);
    return pkg;
  }

  async create(dto: CreateNetworkPackageDto) {
    const [pkg] = await this.sql`
      INSERT INTO network_packages (name, internet, server_installation, technical_info)
      VALUES (${dto.name}, ${dto.internet}, ${dto.server_installation}, ${dto.technical_info || null})
      RETURNING *
    `;
    return pkg;
  }

  async update(id: number, dto: UpdateNetworkPackageDto) {
    await this.findOne(id);
    const updateData: Record<string, any> = { ...dto };
    if (Object.keys(updateData).length === 0) return this.findOne(id);

    const [updated] = await this.sql`
      UPDATE network_packages
      SET ${this.sql(updateData)}
      WHERE package_id = ${id}
      RETURNING *
    `;
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sql`
      DELETE FROM network_packages WHERE package_id = ${id}
    `;
    return { message: `ลบ package id ${id} สำเร็จ` };
  }
}
