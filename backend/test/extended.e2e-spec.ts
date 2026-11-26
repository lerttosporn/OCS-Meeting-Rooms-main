import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Extended API E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Catering API (/catering)', () => {
    it('GET /catering - should return array', () => {
      return request(app.getHttpServer())
        .get('/catering')
        .expect(200);
    });
  });

  describe('Network Packages API (/network-packages)', () => {
    it('GET /network-packages - should return array', () => {
      return request(app.getHttpServer())
        .get('/network-packages')
        .expect(200);
    });
  });

  describe('Tools API (/tools)', () => {
    it('GET /tools - should return array', () => {
      return request(app.getHttpServer())
        .get('/tools')
        .expect(200);
    });
  });

  describe('Tool Maintenance API (/tool-maintenance)', () => {
    it('GET /tool-maintenance - should return array', () => {
      return request(app.getHttpServer())
        .get('/tool-maintenance')
        .expect(200);
    });
  });

  describe('Room Rates API (/room-rates)', () => {
    it('GET /room-rates - should return array', () => {
      return request(app.getHttpServer())
        .get('/room-rates')
        .expect(200);
    });
  });

  describe('Carts API (/carts)', () => {
    it('GET /carts/:userId - should return cart object', () => {
      return request(app.getHttpServer())
        .get('/carts/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('items');
        });
    });
  });

  describe('Payments API (/payments)', () => {
    it('GET /payments - should return array', () => {
      return request(app.getHttpServer())
        .get('/payments')
        .expect(200);
    });
  });

  describe('Booking Penalties API (/booking-penalties)', () => {
    it('GET /booking-penalties - should return array', () => {
      return request(app.getHttpServer())
        .get('/booking-penalties')
        .expect(200);
    });
  });

  describe('Booking Details API (/booking-details)', () => {
    it('GET /booking-details - should return array', () => {
      return request(app.getHttpServer())
        .get('/booking-details')
        .expect(200);
    });

    it('GET /booking-details/:id - should include custom tool from seeds', async () => {
      const res = await request(app.getHttpServer())
        .get('/booking-details/1')
        .expect(200);
      
      const detail = res.body;
      expect(detail).toHaveProperty('tools');
      const customTool = detail.tools.find((t: any) => t.custom_name === '3D Printer');
      expect(customTool).toBeDefined();
      expect(customTool.tool_id).toBeNull();
      expect(customTool.quantity).toBe(1);
      expect(Number(customTool.price_snapshot)).toBe(1500.00);
    });

    it('POST /booking-details/:id/tools - should allow adding a custom tool', async () => {
      const res = await request(app.getHttpServer())
        .post('/booking-details/1/tools')
        .send({
          custom_name: 'Laser Cutter',
          quantity: 1,
          price_snapshot: 2000.00,
        })
        .expect(201);

      expect(res.body).toHaveProperty('booking_tools_id');
      expect(res.body.custom_name).toBe('Laser Cutter');
      expect(res.body.tool_id).toBeNull();
      expect(Number(res.body.price_snapshot)).toBe(2000.00);
    });
  });
});
