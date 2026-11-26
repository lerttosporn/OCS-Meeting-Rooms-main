import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config'; // บรรทัดนี้ทำให้ Node.js อ่านค่าจากไฟล์ .env ได้

// 1. ดึง Connection String มาจากไฟล์ .env 
const dbUrl = process.env.DB_URL;

// ดักจับ Error เผื่อเราลืมสร้างไฟล์ .env
if (!dbUrl) {
  console.error('❌ ไม่พบการตั้งค่า DB_URL ในไฟล์ .env ครับ! กรุณาสร้างไฟล์ .env ก่อน');
  process.exit(1);
}

// เชื่อมต่อฐานข้อมูล
const sql = postgres(dbUrl);

async function setupDatabase() {
  try {
    console.log(`⏳ กำลังเชื่อมต่อฐานข้อมูล...`);
    console.log('⏳ กำลังค้นหาและอ่านไฟล์ schema.sql...');
    
    const sqlFilePath = path.join(__dirname, 'schema.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`หาไฟล์ schema.sql ไม่เจอครับ! ลองเช็กที่: ${sqlFilePath}`);
    }

    const schemaContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('⏳ กำลังสั่งให้ Database รันสคริปต์ทั้งหมด (อาจใช้เวลาสักครู่)...');
    
    await sql.unsafe(schemaContent);

    console.log('✅ สร้างตารางและตั้งค่าฐานข้อมูล (OCS_meeting) สำเร็จ 100%!');
    
  } catch (error) {
    console.error('❌ พังครับ! ลองเช็ก Error ดู:', error);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

setupDatabase();