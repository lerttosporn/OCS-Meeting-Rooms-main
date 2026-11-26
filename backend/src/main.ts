import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // ตัด field ที่ไม่อยู่ใน DTO ออก
      forbidNonWhitelisted: true, // error ถ้าส่ง field แปลกมา
      transform: true,       // แปลง type อัตโนมัติ (string → number)
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('OCS Meeting Rooms API')
    .setDescription('API สำหรับระบบจองห้องประชุม OCS')
    .setVersion('1.0')
    .addTag('organizations', 'จัดการองค์กร')
    .addTag('users', 'จัดการผู้ใช้')
    .addTag('room-types', 'จัดการประเภทห้อง')
    .addTag('rooms', 'จัดการห้องประชุม')
    .addTag('bookings', 'จัดการการจอง')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Backend พร้อมที่: http://localhost:${port}`);
  console.log(`📖 Swagger UI: http://localhost:${port}/api`);
}

bootstrap();