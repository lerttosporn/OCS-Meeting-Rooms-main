import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';

describe('API E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Organizations API (/organizations)', () => {
    it('GET /organizations - should return array of organizations', () => {
      return request(app.getHttpServer())
        .get('/organizations')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0); // From seed data
          expect(res.body[0]).toHaveProperty('org_id');
        });
    });

    it('GET /organizations/:id - should return specific organization', () => {
      return request(app.getHttpServer())
        .get('/organizations/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('org_id', 1);
        });
    });

    it('POST /organizations - should create a new organization', () => {
      return request(app.getHttpServer())
        .post('/organizations')
        .send({
          org_name: 'Test E2E Org',
          org_type: 'company',
          org_code: 'TE2E',
          address: 'E2E City'
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('org_id');
          expect(res.body.org_name).toBe('Test E2E Org');
        });
    });
  });

  describe('Users API (/users)', () => {
    it('GET /users - should return array of users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('POST /users - should create a new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          org_id: 1,
          first_name: 'E2E',
          last_name: 'Test',
          email: `e2e_${Date.now()}@test.com`,
          password: 'password123',
          role: 'staff_tech'
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toMatch(/e2e_.*@test\.com/);
        });
    });
  });

  describe('Room Types API (/room-types)', () => {
    it('GET /room-types - should return array of room types', () => {
      return request(app.getHttpServer())
        .get('/room-types')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Rooms API (/rooms)', () => {
    it('GET /rooms - should return array of rooms', () => {
      return request(app.getHttpServer())
        .get('/rooms')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('room_name');
        });
    });
  });

  describe('Bookings API (/bookings)', () => {
    let roomId: number;

    beforeAll(async () => {
      // Find a valid room ID for booking
      const res = await request(app.getHttpServer()).get('/rooms');
      roomId = res.body[0].room_id;
    });

    it('POST /bookings - should create a booking', () => {
      return request(app.getHttpServer())
        .post('/bookings')
        .send({
          customer_id: 1,
          staff_id: 1,
          total_amount: 1500,
          discount_amount: 0,
          net_amount: 1500,
          payment_status: 'unpaid',
          booking_status: 'draft',
          details: [
            {
              room_id: roomId,
              start_date: '2030-01-01',
              end_date: '2030-01-01',
              start_time: '10:00:00',
              end_time: '12:00:00',
              price_snapshot: 1500
            }
          ]
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('booking_id');
        });
    });
  });
});
