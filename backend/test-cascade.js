const postgres = require('postgres');
const sql = postgres('postgres://postgres:postgres@localhost:5432/ocs_meeting_rooms');

async function testCascade() {
  try {
    const [user] = await sql\INSERT INTO users (org_id, email, password_hash, role, first_name) VALUES (1, 'test@test.com', 'hash', 'customer', 'Test') RETURNING id\;
    const uid = user.id;

    const [booking] = await sql\INSERT INTO booking (customer_id, staff_id, total_amount, booking_status, payment_status) VALUES (\, 2, 100, 'pending', 'pending') RETURNING booking_id\;
    const bid = booking.booking_id;

    const [detail] = await sql\INSERT INTO booking_detail (booking_id, room_id, start_time, end_time, number_of_attendees) VALUES (\, 1, NOW(), NOW(), 10) RETURNING booking_detail_id\;

    console.log('Created user', uid, 'booking', bid);

    await sql.begin(async (s) => {
        await s\DELETE FROM cart_item WHERE cart_id IN (SELECT cart_id FROM cart WHERE user_id = \)\;
        await s\DELETE FROM cart WHERE user_id = \\;
        await s\DELETE FROM payment WHERE booking_id IN (SELECT booking_id FROM booking WHERE customer_id = \ OR staff_id = \)\;
        await s\DELETE FROM booking_detail_catering WHERE booking_detail_id IN (SELECT booking_detail_id FROM booking_detail WHERE booking_id IN (SELECT booking_id FROM booking WHERE customer_id = \ OR staff_id = \))\;
        await s\DELETE FROM booking_detail_tools WHERE booking_detail_id IN (SELECT booking_detail_id FROM booking_detail WHERE booking_id IN (SELECT booking_id FROM booking WHERE customer_id = \ OR staff_id = \))\;
        await s\DELETE FROM booking_network WHERE booking_detail_id IN (SELECT booking_detail_id FROM booking_detail WHERE booking_id IN (SELECT booking_id FROM booking WHERE customer_id = \ OR staff_id = \))\;
        await s\DELETE FROM booking_penalties WHERE booking_detail_id IN (SELECT booking_detail_id FROM booking_detail WHERE booking_id IN (SELECT booking_id FROM booking WHERE customer_id = \ OR staff_id = \))\;
        await s\DELETE FROM booking_detail WHERE booking_id IN (SELECT booking_id FROM booking WHERE customer_id = \ OR staff_id = \)\;
        await s\DELETE FROM booking WHERE customer_id = \ OR staff_id = \\;
        await s\DELETE FROM tool_maintenance WHERE staff_id = \\;
        await s\DELETE FROM users WHERE id = \\;
    });

    console.log('SUCCESS! Cascade logic works perfectly.');

  } catch (e) {
    console.error('SQL ERROR:', e.message);
  } finally {
    process.exit(0);
  }
}
testCascade();
