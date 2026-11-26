import 'dotenv/config';
import postgres from 'postgres';
import * as bcrypt from 'bcryptjs';

const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  console.error('❌ ไม่พบ DB_URL ในไฟล์ .env');
  process.exit(1);
}

const sql = postgres(dbUrl);

async function seed() {
  try {
    console.log('🌱 เริ่ม Seed ข้อมูลทดสอบทั้งหมด...\n');

    // 0. ล้างข้อมูลเก่า (Truncate) - ล้างตามลำดับความสัมพันธ์
    console.log('🧹 ล้างข้อมูลเก่า...');
    await sql`
      TRUNCATE 
        booking_penalties, 
        booking_network, 
        network_packages, 
        booking_detail_catering, 
        catering, 
        tool_maintenance, 
        booking_detail_tools, 
        tools, 
        payment, 
        booking_detail, 
        booking, 
        cart_item, 
        cart, 
        room_rate, 
        room, 
        room_type, 
        users, 
        organizations 
      RESTART IDENTITY CASCADE
    `;

    // 1. Organization
    console.log('📌 สร้าง Organization...');
    const [org] = await sql`
      INSERT INTO organizations (org_name, org_type, org_code, address)
      VALUES ('บริษัท OCS จำกัด', 'private', 'OCS001', '123 ถ.สุขุมวิท กรุงเทพ 10110')
      RETURNING *
    `;
    const orgId = org.org_id;
    console.log(`   ✅ org_id: ${orgId}`);

    // 2. Users
    console.log('👤 สร้าง Users...');
    const hashedCustomerPass = await bcrypt.hash('customer123', 10);
    const hashedAdminPass = await bcrypt.hash('admin123', 10);
    const hashedStaffPass = await bcrypt.hash('staff123', 10);
    const hashedFinancialPass = await bcrypt.hash('financial123', 10);

    const [customer] = await sql`
      INSERT INTO users (org_id, email, password, role, first_name, last_name, phone_number)
      VALUES (${orgId}, 'customer@ocs.com', ${hashedCustomerPass}, 'customer',
              'สมชาย', 'ใจดี', '0812345678')
      RETURNING *
    `;
    const [admin] = await sql`
      INSERT INTO users (org_id, email, password, role, first_name, last_name, phone_number, position)
      VALUES (${orgId}, 'admin@ocs.com', ${hashedAdminPass}, 'admin',
              'วิชัย', 'รักงาน', '0898765432', 'ผู้จัดการ')
      RETURNING *
    `;
    const [staff] = await sql`
      INSERT INTO users (org_id, email, password, role, first_name, last_name, phone_number, position)
      VALUES (${orgId}, 'staff@ocs.com', ${hashedStaffPass}, 'staff_tech',
              'กิตติ', 'ดูแลเครื่อง', '0855555555', 'เจ้าหน้าที่เทคนิค')
      RETURNING *
    `;
    const [financial] = await sql`
      INSERT INTO users (org_id, email, password, role, first_name, last_name, phone_number, position)
      VALUES (${orgId}, 'financial@ocs.com', ${hashedFinancialPass}, 'financial',
              'มาลี', 'จัดการเงิน', '0877777777', 'เจ้าหน้าที่การเงิน')
      RETURNING *
    `;
    console.log(`   ✅ customer id: ${customer.id}, admin id: ${admin.id}, staff id: ${staff.id}, financial id: ${financial.id}`);

    // 3. Room Types
    console.log('🏷️  สร้าง Room Types...');
    const roomTypes = [
      { name: 'ห้องอบรมแบบบรรยาย', description: 'Classroom style - จัดแบบห้องเรียนบรรยาย' },
      { name: 'ห้องอบรมคอมพิวเตอร์', description: 'Classroom with computers' },
      { name: 'ห้องการเรียนการสอนทางไกล', description: 'Tele-conference room' },
      { name: 'ห้องจัดเลี้ยง', description: 'Catering room' },
    ];

    const createdTypes: Record<string, number> = {};
    for (const rt of roomTypes) {
      const [row] = await sql`
        INSERT INTO room_type (name, description)
        VALUES (${rt.name}, ${rt.description})
        RETURNING room_type_id
      `;
      createdTypes[rt.name] = row.room_type_id;
      console.log(`   ✅ [${row.room_type_id}] ${rt.name}`);
    }

    // 4. Rooms
    console.log('\n🏢 สร้าง Rooms (36 ห้อง)...');
    const roomsData = [
      // ห้องอบรมแบบบรรยาย
      { room_name: '801', capacity: 30, floor: 8, room_type: 'ห้องอบรมแบบบรรยาย' },
      { room_name: '802', capacity: 30, floor: 8, room_type: 'ห้องอบรมแบบบรรยาย' },
      { room_name: '301', capacity: 30, floor: 3, room_type: 'ห้องอบรมแบบบรรยาย' },
      { room_name: '803', capacity: 60, floor: 8, room_type: 'ห้องอบรมแบบบรรยาย' },
      { room_name: '804', capacity: 60, floor: 8, room_type: 'ห้องอบรมแบบบรรยาย' },
      { room_name: '806', capacity: 130, floor: 8, room_type: 'ห้องอบรมแบบบรรยาย' },
      { room_name: '408', capacity: 110, floor: 4, room_type: 'ห้องอบรมแบบบรรยาย' },
      { room_name: '510', capacity: 110, floor: 5, room_type: 'ห้องอบรมแบบบรรยาย' },
      { room_name: '306', capacity: 300, floor: 3, room_type: 'ห้องอบรมแบบบรรยาย' },

      // ห้องอบรมคอมพิวเตอร์
      { room_name: '503', capacity: 30, floor: 5, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '403', capacity: 30, floor: 4, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '404', capacity: 30, floor: 4, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '501', capacity: 30, floor: 5, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '502', capacity: 30, floor: 5, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '504', capacity: 30, floor: 5, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '505', capacity: 30, floor: 5, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '409', capacity: 40, floor: 4, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '511', capacity: 40, floor: 5, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '402', capacity: 50, floor: 4, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '405', capacity: 30, floor: 4, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '407', capacity: 50, floor: 4, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '506', capacity: 50, floor: 5, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '302', capacity: 60, floor: 3, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '507', capacity: 60, floor: 5, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '508', capacity: 60, floor: 5, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '509', capacity: 60, floor: 5, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '303', capacity: 65, floor: 3, room_type: 'ห้องอบรมคอมพิวเตอร์' },
      { room_name: '406', capacity: 100, floor: 4, room_type: 'ห้องอบรมคอมพิวเตอร์' },

      // ห้องการเรียนการสอนทางไกล
      { room_name: '911', capacity: 5, floor: 9, room_type: 'ห้องการเรียนการสอนทางไกล' },
      { room_name: '912', capacity: 5, floor: 9, room_type: 'ห้องการเรียนการสอนทางไกล' },
      { room_name: '913', capacity: 5, floor: 9, room_type: 'ห้องการเรียนการสอนทางไกล' },
      { room_name: '906', capacity: 5, floor: 9, room_type: 'ห้องการเรียนการสอนทางไกล' },
      { room_name: '915', capacity: 10, floor: 9, room_type: 'ห้องการเรียนการสอนทางไกล' },
      { room_name: '901', capacity: 25, floor: 9, room_type: 'ห้องการเรียนการสอนทางไกล' },

      // ห้องจัดเลี้ยง
      { room_name: '304', capacity: 160, floor: 3, room_type: 'ห้องจัดเลี้ยง' },
      { room_name: '805', capacity: 120, floor: 8, room_type: 'ห้องจัดเลี้ยง' },
    ];

    const insertedRooms: any[] = [];
    for (const room of roomsData) {
      const roomTypeId = createdTypes[room.room_type];
      const [newRoom] = await sql`
        INSERT INTO room (org_id, room_type_id, room_name, capacity, floor, room_status)
        VALUES (${orgId}, ${roomTypeId}, ${room.room_name}, ${room.capacity}, ${room.floor}, 'available')
        RETURNING *
      `;
      insertedRooms.push(newRoom);
    }
    console.log(`   ✅ สร้างห้องสำเร็จ ${insertedRooms.length} ห้อง`);

    // 5. Room Rates (36 rooms with real prices from spreadsheet)
    console.log('💰 สร้าง Room Rates...');
    const priceMap: Record<string, { half: number; full: number }> = {
      '301': { half: 1950.00, full: 3500.00 },
      '801': { half: 1950.00, full: 3500.00 },
      '802': { half: 1950.00, full: 3500.00 },
      '803': { half: 3450.00, full: 6500.00 },
      '804': { half: 3450.00, full: 6500.00 },
      '805': { half: 5250.00, full: 10100.00 },
      '806': { half: 5250.00, full: 10100.00 },
      '302': { half: 9350.00, full: 18300.00 },
      '303': { half: 10100.00, full: 19800.00 },
      '304': { half: 6200.00, full: 12000.00 },
      '306': { half: 10050.00, full: 19700.00 },
      '402': { half: 8450.00, full: 16500.00 },
      '407': { half: 8450.00, full: 16500.00 },
      '403': { half: 5850.00, full: 11300.00 },
      '404': { half: 5850.00, full: 11300.00 },
      '405': { half: 5850.00, full: 11300.00 },
      '406': { half: 15100.00, full: 29800.00 },
      '408': { half: 5250.00, full: 10100.00 },
      '510': { half: 5250.00, full: 10100.00 },
      '409': { half: 7650.00, full: 14900.00 },
      '511': { half: 7650.00, full: 14900.00 },
      '501': { half: 5850.00, full: 11300.00 },
      '502': { half: 5850.00, full: 11300.00 },
      '503': { half: 5850.00, full: 11300.00 },
      '504': { half: 5850.00, full: 11300.00 },
      '505': { half: 5850.00, full: 11300.00 },
      '506': { half: 8450.00, full: 16500.00 },
      '507': { half: 9350.00, full: 18300.00 },
      '508': { half: 9350.00, full: 18300.00 },
      '509': { half: 9350.00, full: 18300.00 },
      '901': { half: 2950.00, full: 5500.00 },
      '906': { half: 1650.00, full: 2900.00 },
      '911': { half: 1650.00, full: 2900.00 },
      '912': { half: 1650.00, full: 2900.00 },
      '913': { half: 1650.00, full: 2900.00 },
      '915': { half: 2450.00, full: 4500.00 },
    };

    for (const room of insertedRooms) {
      const prices = priceMap[room.room_name];
      if (!prices) {
        console.warn(`⚠️ ไม่พบข้อมูลราคาของห้อง: ${room.room_name}`);
        continue;
      }
      await sql`
        INSERT INTO room_rate (room_id, rate_name, start_time, end_time, price)
        VALUES 
          (${room.room_id}, 'ครึ่งวัน-เช้า (Half Day Morning)', '08:30:00', '12:00:00', ${prices.half}),
          (${room.room_id}, 'ครึ่งวัน-บ่าย (Half Day Afternoon)', '13:00:00', '16:30:00', ${prices.half}),
          (${room.room_id}, 'เต็มวัน (Full Day)', '08:30:00', '16:30:00', ${prices.full})
      `;
    }
    const [sampleRate] = await sql`SELECT * FROM room_rate LIMIT 1`;
    console.log(`   ✅ สร้าง Rates เรียบร้อย (ตัวอย่าง: ${sampleRate.rate_name} - ${sampleRate.price} บาท)`);

    // 6. Tools
    console.log('🛠️  สร้าง Tools...');
    const tools = [
      { name: 'Notebook Computer', description: 'คอมพิวเตอร์โน้ตบุ๊ก', stock: 10 },
      { name: 'Projector', description: 'เครื่องฉายโปรเจคเตอร์', stock: 10 },
      { name: 'Amplifier with Microphone', description: 'เครื่องขยายเสียงพร้อมไมโครโฟน', stock: 10 },
      { name: 'Registration Table', description: 'โต๊ะลงทะเบียน', stock: 10 },
      { name: 'Registration Chair', description: 'เก้าอี้ลงทะเบียน', unit_price: 200.00, stock: 20 },
      { name: 'Whiteboard', description: 'กระดานไวท์บอร์ด', unit_price: 500.00, stock: 15 },
      { name: 'Movable Plasma Display', description: 'จอพลาสมาเคลื่อนที่', unit_price: 500.00, stock: 10 },
      { name: 'Folding Table', description: 'โต๊ะพับได้', unit_price: 250.00, stock: 30 },
      { name: 'Chair', description: 'เก้าอี้', unit_price: 250.00, stock: 10 },
      { name: 'Podium', description: 'โพเดียม', stock: 10 },
      { name: 'nontri account', description: 'บัญชีเครือข่ายนนทรี', stock: null },
    ];
    const insertedTools: any[] = [];
    for (const tool of tools) {
      const [newTool] = await sql`
        INSERT INTO tools (name, description, unit_price, stock)
        VALUES (${tool.name}, ${tool.description ?? null}, ${tool.unit_price ?? null}, ${tool.stock ?? null})
        RETURNING *
      `;
      insertedTools.push(newTool);
      console.log(`   ✅ [${newTool.tool_id}] ${tool.name}`);
    }

    // 7. Catering
    console.log('🍱 สร้าง Catering...');
    const cateringList = [
      { name: 'Snacks and drinks (Morning)', description: 'อาหารว่างและเครื่องดื่ม รอบเช้า' },
      { name: 'Snacks and drinks (Afternoon)', description: 'อาหารว่างและเครื่องดื่ม รอบบ่าย' },
      { name: 'Lunch Box', description: 'อาหารกลางวัน แบบกล่อง' },
      { name: 'Buffet', description: 'อาหารกลางวัน แบบบุฟเฟ่ต์' },
      { name: 'Self-catered', description: '1,000 THB/day environmental fee applies' },

    ];
    const insertedCatering: any[] = [];
    for (const cat of cateringList) {
      const [newCat] = await sql`
        INSERT INTO catering (name, description)
        VALUES (${cat.name}, ${cat.description})
        RETURNING *
      `;
      insertedCatering.push(newCat);
      console.log(`   ✅ [${newCat.catering_id}] ${cat.name}`);
    }

    // 8. Network Packages
    console.log('🌐 สร้าง Network Packages...');
    const netPackages = [
      {
        name: 'Package 1',
        internet: 'Yes',
        server_installation: 'No',
        technical_info: 'If using ports other than 80 or 443, please specify the URL and port.'
      },
      {
        name: 'Package 2',
        internet: 'No',
        server_installation: 'Yes',
        technical_info: 'Users must prepare their own DHCP system.'
      },
      {
        name: 'Package 3',
        internet: 'Yes',
        server_installation: 'Yes',
        technical_info: 'Users must configure the IP address on the server themselves.'
      }
    ];
    const insertedNet: any[] = [];
    for (const pkg of netPackages) {
      const [newPkg] = await sql`
        INSERT INTO network_packages (name, internet, server_installation, technical_info)
        VALUES (${pkg.name}, ${pkg.internet}, ${pkg.server_installation}, ${pkg.technical_info})
        RETURNING *
      `;
      insertedNet.push(newPkg);
      console.log(`   ✅ [${newPkg.package_id}] ${pkg.name}`);
    }

    // 9. Booking & Details
    console.log('\n📅 สร้าง Booking ตัวอย่าง...');
    // Room 806 (insertedRooms[5]) has a Full Day rate of 10100.00
    const [booking] = await sql`
      INSERT INTO booking
        (customer_id, staff_id, total_amount, discount_amount,
         booking_status, payment_status, notes)
      VALUES
        (${customer.id}, ${admin.id}, 11000.00, 0,
         'confirmed', 'paid', 'สัมมนาวิชาการประจำปี')
      RETURNING *
    `;

    const [detail] = await sql`
      INSERT INTO booking_detail
        (booking_id, room_id, topic, start_date, end_date,
         start_time, end_time, price_snapshot, overtime_fee)
      VALUES
        (${booking.booking_id}, ${insertedRooms[5].room_id}, 'สัมมนา AI 2025',
         '2025-06-15', '2025-06-15', '08:30:00', '16:30:00', 10100.00, 0)
      RETURNING *
    `;

    // 10. Booking Sub-details (Tools, Catering, Network)
    console.log('🔗 เชื่อมโยงอุปกรณ์, อาหาร, และเครือข่าย...');
    await sql`
      INSERT INTO booking_detail_tools (booking_detail_id, tool_id, quantity, price_snapshot, custom_name)
      VALUES (${detail.booking_detail_id}, ${insertedTools[0].tool_id}, 1, 500.00, NULL),
             (${detail.booking_detail_id}, ${insertedTools[1].tool_id}, 2, 400.00, NULL),
             (${detail.booking_detail_id}, NULL, 1, 1500.00, '3D Printer')
    `;
    await sql`
      INSERT INTO booking_detail_catering (booking_detail_id, catering_id, quantity)
      VALUES (${detail.booking_detail_id}, ${insertedCatering[0].catering_id}, 50)
    `;
    await sql`
      INSERT INTO booking_network (booking_detail_id, package_id, account_quantity, url)
      VALUES (${detail.booking_detail_id}, ${insertedNet[1].package_id}, 1, 'http://ocs-guest-wifi.com')
    `;

    // 11. Payment
    console.log('💳 บันทึกการชำระเงิน...');
    await sql`
      INSERT INTO payment (booking_id, receipt_number, amount, payment_date, payment_method, transaction_status)
      VALUES (${booking.booking_id}, 'REC-202506-001', 11000.00, '2025-06-01 10:30:00', 'qrcode', 'SUCCESS')
    `;

    // 12. Maintenance & Penalties
    console.log('⚠️ บันทึกประวัติการซ่อมบำรุงและค่าปรับ...');
    await sql`
      INSERT INTO tool_maintenance (tool_id, staff_id, status, report_details)
      VALUES (${insertedTools[0].tool_id}, ${staff.id}, 'repairing', 'เลนส์โปรเจกเตอร์มีรอยขีดข่วน')
    `;
    await sql`
      INSERT INTO booking_penalties (booking_detail_id, tool_id, description, quantity, total_amount)
      VALUES (${detail.booking_detail_id}, ${insertedTools[2].tool_id}, 'Laser Pointer สูญหาย', 1, 500.00)
    `;

    // 13. Carts (Optional data for testing)
    console.log('🛒 สร้างตะกร้าสินค้าค้างไว้...');
    const [cart] = await sql`INSERT INTO cart (user_id) VALUES (${customer.id}) RETURNING *`;
    await sql`
      INSERT INTO cart_item (cart_id, room_id, room_rate_id, start_date, end_date, start_time, end_time)
      VALUES (${cart.cart_id}, ${insertedRooms[0].room_id}, ${sampleRate.room_rate_id}, '2025-07-01', '2025-07-01', '08:30:00', '12:00:00')
    `;

    console.log('\n✅ Seed ข้อมูลสำเร็จครบทุกตาราง!');

  } catch (err) {
    console.error('\n❌ Seed ล้มเหลว:', err);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

seed();
