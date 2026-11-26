import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { CreateBookingDetailDto } from './dto/create-booking-detail.dto';
import { UpdateBookingDetailDto } from './dto/update-booking-detail.dto';
import { AddBookingDetailToolDto } from './dto/booking-detail-tools.dto';
import { AddBookingDetailCateringDto } from './dto/booking-detail-catering.dto';
import { AddBookingNetworkDto } from './dto/booking-network.dto';

@Injectable()
export class BookingDetailsService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  // ==========================================
  // BOOKING DETAILS
  // ==========================================
  async findAll() {
    return await this.sql`SELECT * FROM booking_detail ORDER BY booking_detail_id DESC`;
  }

  async findOne(id: number) {
    const [detail] = await this.sql`SELECT * FROM booking_detail WHERE booking_detail_id = ${id}`;
    if (!detail) throw new NotFoundException(`ไม่พบ booking detail id ${id}`);
    
    const tools = await this.sql`SELECT * FROM booking_detail_tools WHERE booking_detail_id = ${id}`;
    const catering = await this.sql`SELECT * FROM booking_detail_catering WHERE booking_detail_id = ${id}`;
    const network = await this.sql`SELECT * FROM booking_network WHERE booking_detail_id = ${id}`;
    
    return { ...detail, tools, catering, network };
  }

  async create(dto: CreateBookingDetailDto) {
    const [detail] = await this.sql`
      INSERT INTO booking_detail (
        booking_id, room_id, topic, start_date, end_date, start_time, end_time,
        price_snapshot, car_plate1, car_plate2, overtime_fee, external_catering, training_format
      ) VALUES (
        ${dto.booking_id}, ${dto.room_id}, ${dto.topic || null}, ${dto.start_date},
        ${dto.end_date}, ${dto.start_time}, ${dto.end_time}, ${dto.price_snapshot},
        ${dto.car_plate1 || null}, ${dto.car_plate2 || null}, ${dto.overtime_fee || 0}, ${dto.external_catering || null},
        ${dto.training_format || 'ON_SITE'}::training_format_t
      )
      RETURNING *
    `;
    return detail;
  }

  async update(id: number, dto: UpdateBookingDetailDto) {
    await this.findOne(id); // Ensure exists
    const updateData: Record<string, any> = { ...dto };
    if (Object.keys(updateData).length === 0) return this.findOne(id);

    const [updated] = await this.sql`
      UPDATE booking_detail
      SET ${this.sql(updateData)}
      WHERE booking_detail_id = ${id}
      RETURNING *
    `;
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    // Cleanup children first due to constraints
    await this.sql`DELETE FROM booking_detail_tools WHERE booking_detail_id = ${id}`;
    await this.sql`DELETE FROM booking_detail_catering WHERE booking_detail_id = ${id}`;
    await this.sql`DELETE FROM booking_network WHERE booking_detail_id = ${id}`;
    await this.sql`DELETE FROM booking_detail WHERE booking_detail_id = ${id}`;
    return { message: `ลบ booking detail id ${id} พร้อมข้อมูลย่อยสำเร็จ` };
  }

  // ==========================================
  // TOOLS
  // ==========================================
  async addTool(detailId: number, dto: AddBookingDetailToolDto) {
    await this.findOne(detailId);
    const [tool] = await this.sql`
      INSERT INTO booking_detail_tools (booking_detail_id, tool_id, quantity, price_snapshot, custom_name)
      VALUES (${detailId}, ${dto.tool_id ?? null}, ${dto.quantity}, ${dto.price_snapshot}, ${dto.custom_name ?? null})
      RETURNING *
    `;
    return tool;
  }

  async removeTool(detailId: number, toolId: number) {
    const result = await this.sql`
      DELETE FROM booking_detail_tools 
      WHERE booking_detail_id = ${detailId} AND booking_tools_id = ${toolId}
      RETURNING *
    `;
    if (result.count === 0) throw new NotFoundException('ไม่พบ tool นี้ใน booking detail');
    return { message: 'ลบ tool ออกจาก booking detail สำเร็จ' };
  }

  // ==========================================
  // CATERING
  // ==========================================
  async addCatering(detailId: number, dto: AddBookingDetailCateringDto) {
    await this.findOne(detailId);
    const [catering] = await this.sql`
      INSERT INTO booking_detail_catering (booking_detail_id, catering_id, quantity)
      VALUES (${detailId}, ${dto.catering_id}, ${dto.quantity})
      RETURNING *
    `;
    return catering;
  }

  async removeCatering(detailId: number, cateringId: number) {
    const result = await this.sql`
      DELETE FROM booking_detail_catering 
      WHERE booking_detail_id = ${detailId} AND booking_catering_id = ${cateringId}
      RETURNING *
    `;
    if (result.count === 0) throw new NotFoundException('ไม่พบ catering นี้ใน booking detail');
    return { message: 'ลบ catering ออกจาก booking detail สำเร็จ' };
  }

  // ==========================================
  // NETWORK
  // ==========================================
  async addNetwork(detailId: number, dto: AddBookingNetworkDto) {
    await this.findOne(detailId);
    const [network] = await this.sql`
      INSERT INTO booking_network (
        booking_detail_id, account_quantity, package_id, url, port, delivery_email
      ) VALUES (
        ${detailId}, ${dto.account_quantity}, ${dto.package_id}, 
        ${dto.url || null}, ${dto.port || null}, ${dto.delivery_email || null}
      )
      RETURNING *
    `;
    return network;
  }

  async removeNetwork(detailId: number, networkId: number) {
    const result = await this.sql`
      DELETE FROM booking_network 
      WHERE booking_detail_id = ${detailId} AND booking_network_id = ${networkId}
      RETURNING *
    `;
    if (result.count === 0) throw new NotFoundException('ไม่พบ network นี้ใน booking detail');
    return { message: 'ลบ network ออกจาก booking detail สำเร็จ' };
  }
}
