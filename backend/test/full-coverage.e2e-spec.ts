import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Full API Coverage E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // 1. Room Rates
  describe('Room Rates (/room-rates)', () => {
    it('GET /room-rates - should return list of rates', () => {
      return request(app.getHttpServer())
        .get('/room-rates')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  // 2. Tools
  describe('Tools (/tools)', () => {
    it('GET /tools - should return list of tools', () => {
      return request(app.getHttpServer())
        .get('/tools')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('POST /tools - should create a tool', () => {
      return request(app.getHttpServer())
        .post('/tools')
        .send({ name: 'Test Tool', unit_price: 100, stock: 5 })
        .expect(201);
    });
  });

  // 3. Catering
  describe('Catering (/catering)', () => {
    it('GET /catering - should return list of catering items', () => {
      return request(app.getHttpServer())
        .get('/catering')
        .expect(200);
    });
  });

  // 4. Network Packages
  describe('Network Packages (/network-packages)', () => {
    it('GET /network-packages - should return packages', () => {
      return request(app.getHttpServer())
        .get('/network-packages')
        .expect(200);
    });
  });

  // 5. Carts
  describe('Carts (/carts)', () => {
    it('GET /carts/:userId - should return user cart', () => {
      return request(app.getHttpServer())
        .get('/carts/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('items');
        });
    });

    it('POST /cart-items - should add item to cart', () => {
      return request(app.getHttpServer())
        .post('/cart-items')
        .send({
          cart_id: 1,
          room_id: 1,
          room_rate_id: 1,
          start_date: '2025-10-10',
          end_date: '2025-10-10',
          start_time: '09:00:00',
          end_time: '12:00:00'
        })
        .expect(201);
    });
  });

  // 6. Payments
  describe('Payments (/payments)', () => {
    it('GET /payments - should return payments', () => {
      return request(app.getHttpServer())
        .get('/payments')
        .expect(200);
    });
  });

  // 7. Booking Penalties
  describe('Booking Penalties (/booking-penalties)', () => {
    it('GET /booking-penalties - should return penalties', () => {
      return request(app.getHttpServer())
        .get('/booking-penalties')
        .expect(200);
    });
  });

  // 8. Tool Maintenance
  describe('Tool Maintenance (/tool-maintenance)', () => {
    it('GET /tool-maintenance - should return maintenance records', () => {
      return request(app.getHttpServer())
        .get('/tool-maintenance')
        .expect(200);
    });
  });
});
