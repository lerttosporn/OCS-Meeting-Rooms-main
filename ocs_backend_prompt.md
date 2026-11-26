# OCS-Meeting-Rooms Backend — Full Development Prompt

## Project Overview

You are working on a **NestJS + PostgreSQL** backend for an OCS (Organizational Computer Services) meeting room booking system located at `d:\OCS-Meeting-Rooms\backend`.

The tech stack is:
- **Framework**: NestJS (TypeScript)
- **Database driver**: `postgres` (raw SQL, no ORM)
- **Validation**: `class-validator` + `class-transformer`
- **API docs**: `@nestjs/swagger`
- **Auth**: `bcryptjs` + `jsonwebtoken`
- **DB connection**: injected via `SQL` token from `DatabaseModule`

---

## Database Schema Rules

The actual PostgreSQL schema (`src/database/schema.sql`) defines these tables and their **exact column names**:

### Key Tables & Columns

| Table | Columns / Attributes |
|---|---|
| `organizations` | `org_id`, `org_name`, `org_type`, `org_code`, `address` |
| `users` | `id`, `org_id`, `email`, `password`, `role` (ENUM: `customer`,`staff_tech`,`admin`,`financial`), `first_name`, `last_name`, `card_id`, `phone_number`, `position`, `created_at`, `updated_at` |
| `room_type` | `room_type_id`, `name`, `description` |
| `room` | `room_id`, `org_id`, `room_type_id`, `room_name`, `capacity`, `floor`, `room_status` (ENUM: `available`,`maintenance`,`reserved`) |
| `room_rate` | `room_rate_id`, `room_id`, `rate_name`, `start_time`, `end_time`, `price` |
| `cart` | `cart_id`, `user_id`, `created_at`, `updated_at` |
| `cart_item` | `cart_item_id`, `cart_id`, `room_id`, `room_rate_id`, `start_date`, `end_date`, `start_time`, `end_time` |
| `booking` | `booking_id`, `customer_id`, `staff_id`, `total_amount`, `discount_amount`, `booking_status` (ENUM: `approved`,`confirmed`,`completed`,`draft`), `payment_status` (ENUM: `unpaid`,`paid`,`refunded`), `notes`, `bookingdate` |
| `booking_detail` | `booking_detail_id`, `booking_id`, `room_id`, `topic`, `start_date`, `end_date`, `start_time`, `end_time`, `price_snapshot`, `created_at`, `car_plate1`, `car_plate2`, `overtime_fee`, `external_catering` |
| `payment` | `payment_id`, `booking_id`, `receipt_number`, `transaction_ref`, `amount`, `payment_date`, `payment_method` (ENUM: `cash`,`cheque`,`qrcode`,`org_deduct`), `evidence_url`, `transaction_status` (PENDING/SUCCESS/FAILED), `created_at` |
| `tools` | `tool_id`, `name`, `unit_price` (nullable), `stock` |
| `booking_detail_tools` | `booking_tools_id`, `booking_detail_id`, `tool_id`, `quantity`, `price_snapshot` |
| `tool_maintenance` | `maint_id`, `tool_id`, `staff_id`, `status` (ENUM: `broken`,`working`,`repairing`,`disposed`), `report_details`, `created_at`, `resolved_at` |
| `catering` | `catering_id`, `name`, `description` |
| `booking_detail_catering` | `booking_catering_id`, `booking_detail_id`, `catering_id`, `quantity` |
| `network_packages` | `package_id`, `package_name`, `description` |
| `booking_network` | `booking_network_id`, `booking_detail_id`, `account_quantity`, `package_id`, `url`, `port`, `delivery_email` |
| `booking_penalties` | `penalty_id`, `booking_detail_id`, `tool_id`, `description`, `quantity`, `total_amount` |

> **CRITICAL**: The `room_rate` table uses `rate_name` — NOT `rate_type`. The `cart_item` table has `start_date`/`end_date` — NOT `quantity`.

### Schema Setup Strategy
- `schema.sql` starts with `DROP TABLE IF EXISTS ... CASCADE` for ALL tables (in dependency order) before `CREATE TABLE` statements
- This ensures `npm run db:setup` always recreates tables cleanly
- `npm run db:seed` populates all tables with real data

---

## Room Rate Data (from official spreadsheet)

Room rates use **3 slots per room**: ครึ่งวัน-เช้า / ครึ่งวัน-บ่าย / เต็มวัน

| Rate Name | Start | End |
|---|---|---|
| ครึ่งวัน-เช้า (Half Day Morning) | 08:30 | 12:00 |
| ครึ่งวัน-บ่าย (Half Day Afternoon) | 13:00 | 16:30 |
| เต็มวัน (Full Day) | 08:30 | 16:30 |

### Prices per Room (THB)

| Room | Half Day | Full Day |
|---|---|---|
| 301, 801, 802 | 1,950 | 3,500 |
| 803, 804 | 3,450 | 6,500 |
| 805, 806 | 5,250 | 10,100 |
| 302 | 9,350 | 18,300 |
| 303 | 10,100 | 19,800 |
| 304 | 6,200 | 12,000 |
| 306 (Auditorium) | 10,050 | 19,700 |
| 402, 407 | 8,450 | 16,500 |
| 403, 404, 405 | 5,850 | 11,300 |
| 406 (Slope) | 15,100 | 29,800 |
| 408, 510 | 5,250 | 10,100 |
| 409, 511 | 7,650 | 14,900 |
| 501–505 | 5,850 | 11,300 |
| 506 | 8,450 | 16,500 |
| 507–509 | 9,350 | 18,300 |
| 901 | 2,950 | 5,500 |
| 906, 911, 912, 913 | 1,650 | 2,900 |
| 915 | 2,450 | 4,500 |

> Room **903 does NOT exist** — do not include it.

---

## Rooms List (36 rooms total)

### ห้องอบรมแบบบรรยาย (Classroom)
301, 801, 802, 803, 804, 806, 408, 510, 306

### ห้องอบรมคอมพิวเตอร์ (Computer Room)
302, 303, 402, 403, 404, 405, 406, 407, 409, 501, 502, 503, 504, 505, 506, 507, 508, 509, 511

### ห้องการเรียนการสอนทางไกล (Tele-conference)
901, 906, 911, 912, 913, 915

### ห้องจัดเลี้ยง (Catering)
304, 805

---

## API Modules & Endpoints

### Auth / Users (`/users`)
| Method | Route | Description |
|---|---|---|
| POST | `/users/register` | Register — role always set to `customer` (hardcoded) |
| POST | `/users/login` | Login — returns `{ user, token }` JWT (7d expiry) |
| GET | `/users/me/:id` | Get own profile |
| GET | `/users` | List all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create user (Admin — can set any role) |
| PATCH | `/users/:id` | Update user (password is bcrypt-hashed) |
| DELETE | `/users/:id` | Delete user |

**Auth rules:**
- `POST /users/register` → always inserts `role = 'customer'`
- Password is hashed with `bcrypt.hash(password, 10)` before storing
- Login verifies with `bcrypt.compare()`, returns JWT signed with `JWT_SECRET` env var
- JWT payload: `{ sub: id, email, role }`

### Cart (`/carts`)
| Method | Route | Description |
|---|---|---|
| GET | `/carts/:userId` | Get cart with all items |
| POST | `/carts/:userId` | Create empty cart (if not exists) |
| DELETE | `/carts/:userId` | Clear cart |
| POST | `/carts/:userId/checkout` | **Checkout** — convert cart to booking |

**Checkout flow:**
1. Fetch all `cart_item` records for user's cart (join `room_rate` for price)
2. Sum all prices → `total_amount`
3. In a single **transaction**:
   - INSERT into `booking` (status: `draft`, payment: `unpaid`)
   - INSERT one `booking_detail` per cart item
   - DELETE all `cart_item` for the cart
   - DELETE the `cart` record
4. Return `{ message, booking_id, total_amount, room_count, booking: { ...details } }`

Request body: `{ staff_id: number, notes?: string }`

### Cart Items (`/cart-items`)
- DTO fields: `cart_id`, `room_id`, `room_rate_id`, `start_date`, `end_date`, `start_time?`, `end_time?`
- **No `quantity` field** — cart_item does not have this column

### Bookings (`/bookings`)
| Method | Route | Description |
|---|---|---|
| GET | `/bookings` | List all bookings |
| GET | `/bookings/:id` | Get booking + details |
| POST | `/bookings` | Create booking with details (transaction) |
| PATCH | `/bookings/:id/status` | Update booking/payment status |

**POST body:**
```json
{
  "customer_id": 1,
  "staff_id": 2,
  "total_amount": 5500,
  "discount_amount": 0,
  "booking_status": "draft",
  "payment_status": "unpaid",
  "notes": "optional",
  "details": [
    {
      "room_id": 1,
      "start_date": "2025-07-01",
      "end_date": "2025-07-01",
      "start_time": "08:30:00",
      "end_time": "16:30:00",
      "price_snapshot": 5500,
      "topic": "optional"
    }
  ]
}
```

### Booking Details (`/booking-details`)
After creating a booking, add extras per `booking_detail_id`:
- `POST /booking-details/:id/tools` — add tools
- `POST /booking-details/:id/catering` — add catering items
- `POST /booking-details/:id/network` — add network package
- `DELETE /booking-details/:id/tools/:toolId`
- `DELETE /booking-details/:id/catering/:cateringId`
- `DELETE /booking-details/:id/network/:networkId`

### Room Rates (`/room-rates`)
- Uses columns: `room_id`, `rate_name`, `start_time`, `end_time`, `price`
- **No `rate_type` column** — was removed, replaced by `rate_name`
- `FindAll` orders by `room_id, rate_name`

### Network Packages (`/network-packages`)
Columns: `package_id`, `package_name`, `description`

Seed data:
- Package 1: package_name="Basic WiFi", description="ความเร็ว 100/100 Mbps"
- Package 2: package_name="Premium WiFi", description="ความเร็ว 500/500 Mbps + Dedicated IP"
- Package 3: package_name="Event LAN", description="สาย LAN สำหรับสตรีมมิ่ง 1 Gbps"

---

## Key Implementation Details

### DatabaseModule (`src/database/database.module.ts`)
- Implements `OnApplicationShutdown` to close Postgres pool on `app.close()`
- This prevents Jest worker from hanging after E2E tests

### SQL Query Rules
- Always use `postgres` tagged template literals
- For nullable fields use `${value ?? null}` — never `${undefined}`
- For ENUM casts use: `${value}::booking_status_t` etc.
- For updates use `this.sql(updateData)` spread pattern

### UsersService — password update
When updating a user's password via PATCH, hash it first:
```typescript
if (password) updateData.password = await bcrypt.hash(password, 10);
```

---

## Environment Variables (`.env`)
```
PORT=3001
DB_URL=postgresql://admin:mysecretpassword@localhost:5432/OCS_meeting
ADMIN_DB_URL=postgresql://admin:mysecretpassword@localhost:5432/postgres
JWT_SECRET=ocs-super-secret-jwt-key-2025
```

---

## NPM Scripts
```bash
npm run db:setup   # Drop all tables, recreate from schema.sql
npm run db:seed    # Populate all tables with real data
npm run start:dev  # Start with nodemon watch
npm run test:e2e   # Run E2E tests
```

---

## E2E Test Setup
All test files in `test/` use:
```typescript
import request = require('supertest');
```
(NOT `import request from 'supertest'`)

Every test file has:
```typescript
afterAll(async () => {
  await app.close(); // closes DB pool, prevents Jest worker hang
});
```

---

## Common Bug Fixes Applied

| Bug | Fix |
|---|---|
| `rate_type` column not found | Renamed to `rate_name` in all SQL queries and DTOs |
| `quantity` column not found in cart_item | Removed; use `start_date`/`end_date` instead |
| `networkk_packages` typo | Fixed to `network_packages`; added DROP to schema.sql |
| `sampleRate` undefined reference in seed | Replaced with fresh query: `SELECT room_rate_id WHERE room_id = ... LIMIT 1` |
| `unit_price` undefined (nullable tools) | Use `${tool.unit_price ?? null}` |
| TS2300 duplicate imports | Removed redundant import lines in booking-penalties, catering, network-packages, tool-maintenance modules |
| Jest worker not exiting | Implemented `OnApplicationShutdown` in DatabaseModule |
| `TypeError: request is not a function` | Changed supertest import to `import request = require('supertest')` |
| Room 903 doesn't exist | Removed from roomsData and roomRateMap |
