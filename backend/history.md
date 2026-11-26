# Project History

## 2026-05-08: Add Floor Field and Filter
- Modified `schema.sql` to add `floor` column to `room` table
- Updated `CreateRoomDto` in `src/rooms/dto/create-room.dto.ts` to include `floor`
- Updated `findAll` in `RoomsController` and `RoomsService` to accept and process the `floor` filter query parameter
- Updated `RoomsService.create` to insert `floor` when creating new rooms
- Updated `seed.ts` and `seed-rooms.ts` to populate the `floor` field
- Reset room sequence and re-inserted seed data with correct `floor` values

## 2026-05-14: Consolidated Seed Scripts
- Combined `seed.ts` and `seed-rooms.ts` into a single `seed.ts` file
- Integrated all 29 rooms and their respective room types directly into the main seed script
- Added `TRUNCATE ... RESTART IDENTITY CASCADE` at the beginning of `seed.ts` for clean database initialization
- Removed redundant `seed-rooms.ts` and updated `package.json` to use only `npm run db:seed`

## 2026-05-14: Fix Duplicate Import Errors (TS2300)
- Removed redundant import lines in:
  - `BookingPenaltiesModule`
  - `CateringModule`
  - `NetworkPackagesModule`
  - `ToolMaintenanceModule`
- Resolved identifier conflicts causing compilation failures

## 2026-05-14: Full Database Seeding
- Added realistic mock data for all 18 tables in `schema.sql`
- Included `room_rate`, `tools`, `catering`, `network_packages`, `payment`, and `maintenance` data
- Established valid foreign key relationships across all seeded records
- Updated `TRUNCATE` logic in `seed.ts` to cover all new tables

## 2026-05-14: Test Fixes & API Coverage
- Fixed bug in `RoomsService.update` that incorrectly used input DTO and missed enum casting
- Added explicit `role_t` casting in `UsersService.update`
- Fixed `test/test-setup.ts` by removing the redundant call to the deleted `seed-rooms.ts`
- Created `test/full-coverage.e2e-spec.ts` to provide E2E coverage for all modules (Tools, Catering, Payments, Carts, etc.)
- Verified all Services use proper type casting for Postgres Enums during Create/Update operations

## 2026-05-14: E2E Test Fixes & Graceful Shutdown
- Fixed `TypeError: request is not a function` by updating `supertest` imports to `import request = require('supertest');` in all E2E test files
- Implemented `OnApplicationShutdown` in `DatabaseModule` to properly close the Postgres connection pool
- Resolved Jest warning "worker process failing to exit gracefully" by ensuring all DB connections are closed during `app.close()`

## 2026-05-14: SQL & Schema Synchronization
- Fixed `RoomRatesService`, `CartsService`, and `CartItemsService` to use `rate_name` instead of the non-existent `rate_type`
- Removed `quantity` from `CartItemsService` and `CreateCartItemDto` to match `schema.sql`
- Added `start_date` and `end_date` to `CartItemsService` and `CreateCartItemDto` as required by the database
- Cleaned up redundant type casting (`::rate_type_t`) in SQL queries

## 2026-05-15: Cart Checkout Feature
- เพิ่ม `POST /carts/:userId/checkout` endpoint
- ระบบดึง cart items ทั้งหมด → สร้าง booking + booking_details ใน 1 transaction อัตโนมัติ
- คำนวณ `total_amount` จากราคาใน `room_rate` ของแต่ละรายการ
- ล้าง cart อัตโนมัติหลัง checkout สำเร็จ
- รับ `{ staff_id, notes? }` ใน request body
