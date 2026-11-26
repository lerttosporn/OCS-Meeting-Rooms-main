import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  async findAll() {
    return await this.sql`
      SELECT * FROM payment
      ORDER BY created_at DESC
    `;
  }

  async findOne(id: number) {
    const [payment] = await this.sql`
      SELECT * FROM payment WHERE payment_id = ${id}
    `;
    if (!payment) throw new NotFoundException(`ไม่พบ payment id ${id}`);
    return payment;
  }

  async create(dto: CreatePaymentDto) {
    const [payment] = await this.sql`
      INSERT INTO payment (
        booking_id, receipt_number, transaction_ref, amount,
        payment_date, payment_method, evidence_url, transaction_status
      ) VALUES (
        ${dto.booking_id}, ${dto.receipt_number || null}, ${dto.transaction_ref || null},
        ${dto.amount}, ${dto.payment_date}, ${dto.payment_method}::payment_method_t,
        ${dto.evidence_url || null}, ${dto.transaction_status}
      )
      RETURNING *
    `;
    return payment;
  }

  async update(id: number, dto: UpdatePaymentDto) {
    await this.findOne(id);
    const { payment_method, ...rest } = dto;
    const updateData: Record<string, any> = { ...rest };
    if (payment_method) updateData.payment_method = this.sql`${payment_method}::payment_method_t`;

    if (Object.keys(updateData).length === 0) return this.findOne(id);

    const [updated] = await this.sql`
      UPDATE payment
      SET ${this.sql(updateData)}
      WHERE payment_id = ${id}
      RETURNING *
    `;
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sql`
      DELETE FROM payment WHERE payment_id = ${id}
    `;
    return { message: `ลบ payment id ${id} สำเร็จ` };
  }
}
