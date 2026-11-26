import { Injectable, Inject, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import {
  CreateBookingDto,
  UpdateBookingStatusDto,
} from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(@Inject(SQL) private sql: postgres.Sql) { }

  async findAll(status?: string) {
    let queryStatus = status;
    if (status === 'complete') {
      queryStatus = 'completed';
    }

    return await this.sql`
      SELECT b.*,
             u_cust.first_name || ' ' || COALESCE(u_cust.last_name, '') AS customer_name,
             (
               SELECT STRING_AGG(r.room_name, ', ')
               FROM booking_detail bd
               JOIN room r ON bd.room_id = r.room_id
               WHERE bd.booking_id = b.booking_id
             ) AS room_name,
             (
               SELECT TO_CHAR(MIN(bd.start_date), 'YYYY-MM-DD')
               FROM booking_detail bd
               WHERE bd.booking_id = b.booking_id
             ) AS start_date,
             (
               SELECT TO_CHAR(MAX(bd.end_date), 'YYYY-MM-DD')
               FROM booking_detail bd
               WHERE bd.booking_id = b.booking_id
             ) AS end_date,
             (
               SELECT TO_CHAR(MIN(bd.start_time), 'HH24:MI')
               FROM booking_detail bd
               WHERE bd.booking_id = b.booking_id
             ) AS start_time,
             (
               SELECT TO_CHAR(MAX(bd.end_time), 'HH24:MI')
               FROM booking_detail bd
               WHERE bd.booking_id = b.booking_id
             ) AS end_time,
             (
               SELECT STRING_AGG(bd.topic, ', ')
               FROM booking_detail bd
               WHERE bd.booking_id = b.booking_id
             ) AS topic
      FROM booking b
      JOIN users u_cust ON b.customer_id = u_cust.id
      JOIN users u_staff ON b.staff_id = u_staff.id
      WHERE ${queryStatus ? this.sql`b.booking_status = ${queryStatus}::booking_status_t` : this.sql`true`}
      ORDER BY b.booking_id DESC
    `;
  }

  async findAllMonthlyBookings(yearMonth: string, status?: string) {
    let queryStatus = status;
    if (status === 'complete') {
      queryStatus = 'completed';
    }

    return await this.sql`
      SELECT
        b.booking_id,
        b.booking_status,
        bd.booking_detail_id,
        bd.start_date,
        bd.end_date,
        bd.start_time,
        bd.end_time,
        bd.topic,
        r.room_id,
        r.room_name,
        r.floor,
        r.room_type_id,
        u_cust.first_name || ' ' || COALESCE(u_cust.last_name, '') AS customer_name,
        u_cust.position AS organization
      FROM booking b
      JOIN booking_detail bd ON b.booking_id = bd.booking_id
      JOIN room r ON bd.room_id = r.room_id
      JOIN users u_cust ON b.customer_id = u_cust.id
      WHERE TO_CHAR(bd.start_date, 'YYYY-MM') = ${yearMonth}
        AND ${queryStatus ? this.sql`b.booking_status = ${queryStatus}::booking_status_t` : this.sql`true`}
      ORDER BY bd.start_date ASC, bd.start_time ASC
    `;
  }

  async findByUser(userId: number, status?: string) {
    let queryStatus = status;
    if (status === 'complete') {
      queryStatus = 'completed';
    }

    const bookings = await this.sql`
      SELECT
        b.booking_id,
        b.customer_id,
        b.booking_status,
        b.payment_status,
        b.total_amount,
        b.notes,
        bd.created_at,
        bd.booking_detail_id,
        bd.room_id,
        r.room_name,
        bd.topic,
        bd.start_date,
        bd.end_date,
        bd.start_time,
        bd.end_time,
        bd.price_snapshot,
        bd.car_plate1,
        bd.car_plate2
      FROM booking b
      JOIN booking_detail bd ON bd.booking_id = b.booking_id
      JOIN room r ON r.room_id = bd.room_id
      WHERE b.customer_id = ${userId}
        AND ${queryStatus ? this.sql`b.booking_status = ${queryStatus}::booking_status_t` : this.sql`true`}
      ORDER BY b.booking_id DESC, bd.booking_detail_id ASC
    `;
    return bookings;
  }

  async findOne(id: number) {
    const [booking] = await this.sql`
      SELECT b.*,
             u_cust.first_name || ' ' || COALESCE(u_cust.last_name, '') AS customer_name,
             u_staff.first_name || ' ' || COALESCE(u_staff.last_name, '') AS staff_name
      FROM booking b
      JOIN users u_cust ON b.customer_id = u_cust.id
      JOIN users u_staff ON b.staff_id = u_staff.id
      WHERE b.booking_id = ${id}
    `;
    if (!booking) throw new NotFoundException(`ไม่พบ booking id ${id}`);

    // ดึง booking details
    const details = await this.sql`
      SELECT bd.*, r.room_name
      FROM booking_detail bd
      JOIN room r ON bd.room_id = r.room_id
      WHERE bd.booking_id = ${id}
    `;

    return { ...booking, details };
  }

  /**
   * ตรวจสอบว่าห้องว่างในช่วงเวลาที่ต้องการ
   * Overlap condition: date ranges overlap AND time ranges overlap
   * Active statuses: draft, approved, confirmed (ไม่รวม completed)
   */
  private async checkRoomAvailability(
    roomId: number,
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string,
  ) {
    const conflicts = await this.sql`
      SELECT bd.booking_detail_id, bd.start_date, bd.end_date,
             bd.start_time, bd.end_time, b.booking_status
      FROM booking_detail bd
      JOIN booking b ON bd.booking_id = b.booking_id
      WHERE bd.room_id = ${roomId}
        AND b.booking_status IN ('draft', 'approved', 'confirmed')
        AND bd.start_date <= ${endDate}::date
        AND bd.end_date   >= ${startDate}::date
        AND bd.start_time <  ${endTime}::time
        AND bd.end_time   >  ${startTime}::time
    `;

    if (conflicts.length > 0) {
      const c = conflicts[0];
      throw new ConflictException(
        `ห้อง id ${roomId} ไม่ว่างในช่วงเวลาที่เลือก ` +
        `(${c.start_date} ${c.start_time} – ${c.end_date} ${c.end_time}, ` +
        `สถานะ: ${c.booking_status})`,
      );
    }
  }

  async create(dto: CreateBookingDto) {
    // ตรวจสอบความว่างของห้องก่อนเริ่ม transaction
    for (const d of dto.details) {
      await this.checkRoomAvailability(
        d.room_id,
        d.start_date,
        d.end_date,
        d.start_time,
        d.end_time,
      );
    }

    try {
      // ใช้ transaction เพื่อสร้าง booking + details พร้อมกัน
      return await this.sql.begin(async (tx) => {
      const [booking] = await tx`
        INSERT INTO booking
          (customer_id, staff_id, total_amount, discount_amount,
           booking_status, payment_status, notes)
        VALUES
          (${dto.customer_id}, ${dto.staff_id}, ${dto.total_amount},
           ${dto.discount_amount ?? 0}, ${dto.booking_status}::booking_status_t,
           ${dto.payment_status}::payment_status_t, ${dto.notes ?? null})
        RETURNING *
      `;

      const details = await Promise.all(
        dto.details.map(async (d) => {
          const detailRow = await tx`
            INSERT INTO booking_detail
              (booking_id, room_id, topic, start_date, end_date,
               start_time, end_time, price_snapshot, car_plate1, car_plate2, overtime_fee, training_format)
            VALUES
              (${booking.booking_id}, ${d.room_id}, ${d.topic ?? null},
               ${d.start_date}, ${d.end_date}, ${d.start_time},
               ${d.end_time}, ${d.price_snapshot}, ${d.car_plate1 ?? null}, ${d.car_plate2 ?? null}, ${d.overtime_fee ?? 0.00},
               ${d.training_format ?? 'ON_SITE'}::training_format_t)
            RETURNING *
          `.then((rows) => rows[0]);

          if (d.tools && d.tools.length > 0) {
            await Promise.all(
              d.tools.map((t) =>
                tx`
                  INSERT INTO booking_detail_tools
                    (booking_detail_id, tool_id, quantity, price_snapshot, custom_name)
                  VALUES
                    (${detailRow.booking_detail_id}, ${t.tool_id ?? null}, ${t.quantity}, ${t.price_snapshot}, ${t.custom_name ?? null})
                `
              )
            );
          }

          if (d.caterings && d.caterings.length > 0) {
            await Promise.all(
              d.caterings.map((c) =>
                tx`
                  INSERT INTO booking_detail_catering
                    (booking_detail_id, catering_id, quantity)
                  VALUES
                    (${detailRow.booking_detail_id}, ${c.catering_id}, ${c.quantity})
                `
              )
            );
          }

          if (d.networks && d.networks.length > 0) {
            await Promise.all(
              d.networks.map((n) =>
                tx`
                  INSERT INTO booking_network
                    (booking_detail_id, account_quantity, package_id, url, port, delivery_email)
                  VALUES
                    (${detailRow.booking_detail_id}, ${n.account_quantity}, ${n.package_id}, 
                     ${n.url ?? null}, ${n.port ?? null}, ${n.delivery_email ?? null})
                `
              )
            );
          }
          return detailRow;
        }),
      );

      return { ...booking, details };
    });
    } catch (err: any) {
      console.error('Error creating booking:', err);
      throw new InternalServerErrorException(`สร้างการจองไม่สำเร็จ: ${err.message || err}`);
    }
  }

  async updateStatus(id: number, dto: UpdateBookingStatusDto) {
    await this.findOne(id);

    // อัพเดต booking_status + payment_status (ถ้ามี)
    let updatedBooking;
    if (dto.payment_status) {
      const [booking] = await this.sql`
        UPDATE booking
        SET booking_status  = ${dto.booking_status}::booking_status_t,
            payment_status  = ${dto.payment_status}::payment_status_t
        WHERE booking_id = ${id}
        RETURNING *
      `;
      updatedBooking = booking;
    } else {
      // อัพเดตเฉพาะ booking_status
      const [booking] = await this.sql`
        UPDATE booking
        SET booking_status = ${dto.booking_status}::booking_status_t
        WHERE booking_id = ${id}
        RETURNING *
      `;
      updatedBooking = booking;
    }

    // อัปเดต room_status ของห้องพักที่จองถ้าหากเป็นการ Approve หรือ Cancel
    const details = await this.sql`
      SELECT room_id FROM booking_detail
      WHERE booking_id = ${id}
    `;

    if (details.length > 0) {
      const roomIds = details.map(d => d.room_id);
      if (dto.booking_status === 'approved') {
        await this.sql`
          UPDATE room
          SET room_status = 'reserved'::room_status_t
          WHERE room_id IN ${this.sql(roomIds)}
        `;
      } else if (dto.booking_status === 'cancel') {
        await this.sql`
          UPDATE room
          SET room_status = 'available'::room_status_t
          WHERE room_id IN ${this.sql(roomIds)}
        `;
      }
    }

    return updatedBooking;
  }


}
