import { Module, Global, OnApplicationShutdown, Inject } from '@nestjs/common';
import postgres from 'postgres';

// Token สำหรับ inject ใน service
export const SQL = 'SQL';

const sqlProvider = {
  provide: SQL,
  useFactory: () => {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error('❌ ไม่พบ DB_URL ในไฟล์ .env');
    }
    return postgres(dbUrl);
  },
};

@Global() // ทำให้ทุก module ใช้ได้โดยไม่ต้อง import DatabaseModule ซ้ำ
@Module({
  providers: [sqlProvider],
  exports: [SQL],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async onApplicationShutdown() {
    console.log('🔌 Closing Database connection pool...');
    await this.sql.end();
  }
}
