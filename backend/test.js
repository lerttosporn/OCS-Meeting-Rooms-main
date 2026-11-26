const postgres = require('postgres');
const sql = postgres('postgresql://admin:mysecretpassword@localhost:5432/OCS_meeting');

async function testCascade() {
  try {
    await sql.begin(async (tx) => {
        const [user] = await tx`INSERT INTO users (org_id, email, password_hash, role, first_name) VALUES (1, 'testbook@test.com', 'hash', 'customer', 'Test') RETURNING id`;
        
        const [booking] = await tx`
            INSERT INTO booking
            (customer_id, staff_id, total_amount, discount_amount,
            booking_status, payment_status, notes)
            VALUES
            (${user.id}, ${user.id}, 1500, 0, 'draft'::booking_status_t, 'unpaid'::payment_status_t, null)
            RETURNING *
        `;

        const detailRow = await tx`
            INSERT INTO booking_detail
              (booking_id, room_id, topic, start_date, end_date,
               start_time, end_time, price_snapshot, car_plate1, car_plate2, overtime_fee, training_format)
            VALUES
              (${booking.booking_id}, 1, null,
               '2026-06-10', '2026-06-10', '09:00:00',
               '12:00:00', 1500, null, null, 0,
               'ON_SITE'::training_format_t)
            RETURNING *
          `.then((rows) => rows[0]);
    });
    console.log('SUCCESS');
  } catch (e) {
    console.error('SQL ERROR:', e.message);
  } finally {
    process.exit(0);
  }
}
testCascade();
