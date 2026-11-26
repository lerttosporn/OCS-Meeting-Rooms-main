DROP TABLE IF EXISTS "booking_penalties" CASCADE;
DROP TABLE IF EXISTS "booking_network" CASCADE;
DROP TABLE IF EXISTS "network_packages" CASCADE;
DROP TABLE IF EXISTS "booking_detail_catering" CASCADE;
DROP TABLE IF EXISTS "catering" CASCADE;
DROP TABLE IF EXISTS "tool_maintenance" CASCADE;
DROP TABLE IF EXISTS "booking_detail_tools" CASCADE;
DROP TABLE IF EXISTS "tools" CASCADE;
DROP TABLE IF EXISTS "payment" CASCADE;
DROP TABLE IF EXISTS "booking_detail" CASCADE;
DROP TABLE IF EXISTS "booking" CASCADE;
DROP TABLE IF EXISTS "cart_item" CASCADE;
DROP TABLE IF EXISTS "cart" CASCADE;
DROP TABLE IF EXISTS "room_rate" CASCADE;
DROP TABLE IF EXISTS "room" CASCADE;
DROP TABLE IF EXISTS "room_type" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "organizations" CASCADE;

DROP TYPE IF EXISTS "role_t" CASCADE;
DROP TYPE IF EXISTS "room_status_t" CASCADE;
DROP TYPE IF EXISTS "booking_status_t" CASCADE;
DROP TYPE IF EXISTS "payment_status_t" CASCADE;
DROP TYPE IF EXISTS "payment_method_t" CASCADE;
DROP TYPE IF EXISTS "status_t" CASCADE;
DROP TYPE IF EXISTS "org_type_t" CASCADE;
DROP TYPE IF EXISTS "training_format_t" CASCADE;

CREATE TYPE "org_type_t" AS ENUM ('private', 'public');

CREATE TABLE IF NOT EXISTS "organizations" (
	"org_id" serial NOT NULL,
	"org_name" varchar(255) NOT NULL,
	"org_type" org_type_t NOT NULL,
	"org_code" varchar(50) NOT NULL,
	"address" text NOT NULL,
	PRIMARY KEY("org_id")
);


CREATE TYPE "role_t" AS ENUM ('customer', 'staff_tech', 'admin', 'financial');

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial NOT NULL,
	"org_id" int NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"role" role_t NOT NULL,
	"first_name" varchar(60) NOT NULL,
	"last_name" varchar(60),
	"card_id" varchar(13),
	"phone_number" varchar(10),
	"position" varchar(255),
	"created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE INDEX "idx_users_org_id"
ON "users" ("org_id");
CREATE TABLE IF NOT EXISTS "room_type" (
	"room_type_id" serial NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	PRIMARY KEY("room_type_id")
);


CREATE TYPE "room_status_t" AS ENUM ('available', 'maintenance', 'reserved');

CREATE TABLE IF NOT EXISTS "room" (
	"room_id" serial NOT NULL,
	"org_id" int NOT NULL,
	"room_type_id" int NOT NULL,
	"room_name" varchar(100) NOT NULL,
	"capacity" int NOT NULL CHECK("capacity" > 0),
	"floor" int NOT NULL,
	"room_status" room_status_t NOT NULL,
	PRIMARY KEY("room_id")
);

CREATE INDEX "idx_room_org_id"
ON "room" ("org_id");
CREATE INDEX "idx_room_type_id"
ON "room" ("room_type_id");
CREATE INDEX "idx_room_status"
ON "room" ("room_status");
CREATE INDEX "idx_room_availability"
ON "room" ("room_status", "capacity");
CREATE TABLE IF NOT EXISTS "room_rate" (
	"room_rate_id" serial NOT NULL,
	"room_id" int NOT NULL,
	"rate_name" varchar(100) NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"price" decimal(10,2) NOT NULL DEFAULT 0.00 CHECK("price" >= 0),
	PRIMARY KEY("room_rate_id")
);

CREATE INDEX "room_rate_index_0"
ON "room_rate" ("room_id");
CREATE TABLE IF NOT EXISTS "cart" (
	"cart_id" serial NOT NULL,
	"user_id" int NOT NULL,
	"created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("cart_id")
);

CREATE INDEX "cart_index_0"
ON "cart" ("user_id");
CREATE TABLE IF NOT EXISTS "cart_item" (
	"cart_item_id" serial NOT NULL,
	"cart_id" int NOT NULL,
	"room_id" int NOT NULL,
	"room_rate_id" int NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	PRIMARY KEY("cart_item_id")
);

CREATE INDEX "cart_item_index_0"
ON "cart_item" ("cart_id");
CREATE INDEX "cart_item_index_1"
ON "cart_item" ("room_id");
CREATE INDEX "cart_item_index_2"
ON "cart_item" ("room_rate_id");
CREATE TYPE "booking_status_t" AS ENUM ('approved', 'confirmed', 'completed', 'draft', 'cancel');

CREATE TYPE "payment_status_t" AS ENUM ('unpaid', 'paid', 'refunded');

CREATE TABLE IF NOT EXISTS "booking" (
	"booking_id" serial NOT NULL,
	"customer_id" int NOT NULL,
	"staff_id" int NOT NULL,
	"total_amount" decimal(10,2) NOT NULL,
	"discount_amount" decimal(10,2) DEFAULT 0.00,
	"booking_status" booking_status_t NOT NULL,
	"payment_status" payment_status_t NOT NULL,
	"notes" text,
	"bookingdate" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("booking_id")
);

CREATE INDEX "idx_booking_customer_id"
ON "booking" ("customer_id");
CREATE INDEX "idx_booking_staff_id"
ON "booking" ("staff_id");
CREATE INDEX "idx_booking_status"
ON "booking" ("booking_status");
CREATE INDEX "idx_booking_payment_status"
ON "booking" ("payment_status");
CREATE TYPE "training_format_t" AS ENUM ('ON_SITE', 'HYBRID');

CREATE TABLE IF NOT EXISTS "booking_detail" (
	"booking_detail_id" serial NOT NULL,
	"booking_id" int NOT NULL,
	"room_id" int NOT NULL,
	"topic" varchar(255),
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"price_snapshot" decimal(10,2) NOT NULL,
	"created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	"car_plate1" varchar(255),
	"car_plate2" varchar(255),
	"overtime_fee" decimal(10,2) DEFAULT 0.00,
	"external_catering" decimal(10,2),
	"training_format" training_format_t NOT NULL DEFAULT 'ON_SITE',
	PRIMARY KEY("booking_detail_id")
);

CREATE INDEX "idx_booking_detail_booking_id"
ON "booking_detail" ("booking_id");
CREATE INDEX "idx_booking_dates"
ON "booking_detail" ("start_date", "end_date");
CREATE INDEX "booking_detail_index_2"
ON "booking_detail" ("room_id");
CREATE TYPE "payment_method_t" AS ENUM ('cash', 'cheque', 'qrcode', 'org_deduct');

CREATE TABLE IF NOT EXISTS "payment" (
	"payment_id" serial NOT NULL,
	"booking_id" int NOT NULL,
	"receipt_number" varchar(50) UNIQUE,
	"transaction_ref" varchar(100),
	"amount" decimal(10,2) NOT NULL CHECK("amount" > 0),
	"payment_date" TIMESTAMPTZ NOT NULL,
	"payment_method" payment_method_t NOT NULL,
	"evidence_url" varchar(255),
	"transaction_status" varchar(20) NOT NULL CHECK("transaction_status" IN ('PENDING', 'SUCCESS', 'FAILED')),
	"created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("payment_id")
);

CREATE INDEX "idx_payment_booking_id"
ON "payment" ("booking_id");
CREATE TABLE IF NOT EXISTS "tools" (
	"tool_id" serial NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"unit_price" decimal(10,2),
	"stock" int DEFAULT 0 CHECK("stock" >= 0),
	PRIMARY KEY("tool_id")
);


CREATE TABLE IF NOT EXISTS "booking_detail_tools" (
	"booking_tools_id" serial NOT NULL,
	"booking_detail_id" int NOT NULL,
	"tool_id" int,
	"custom_name" varchar(255),
	"quantity" int NOT NULL CHECK("quantity" > 0),
	"price_snapshot" decimal(10,2) NOT NULL,
	PRIMARY KEY("booking_tools_id"),
	CONSTRAINT "check_tool_or_custom" CHECK ("tool_id" IS NOT NULL OR "custom_name" IS NOT NULL)
);

CREATE INDEX "booking_detail_tools_index_0"
ON "booking_detail_tools" ("booking_detail_id");
CREATE INDEX "booking_detail_tools_index_1"
ON "booking_detail_tools" ("tool_id");
CREATE TYPE "status_t" AS ENUM ('broken', 'working', 'repairing', 'disposed');

CREATE TABLE IF NOT EXISTS "tool_maintenance" (
	"maint_id" serial NOT NULL,
	"tool_id" int NOT NULL,
	"staff_id" int NOT NULL,
	"status" status_t NOT NULL,
	"report_details" text,
	"created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	"resolved_at" TIMESTAMPTZ,
	PRIMARY KEY("maint_id")
);

CREATE INDEX "tool_maintenance_index_0"
ON "tool_maintenance" ("tool_id");
CREATE INDEX "tool_maintenance_index_1"
ON "tool_maintenance" ("staff_id");
CREATE TABLE IF NOT EXISTS "catering" (
	"catering_id" serial NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	PRIMARY KEY("catering_id")
);


CREATE TABLE IF NOT EXISTS "booking_detail_catering" (
	"booking_catering_id" serial NOT NULL,
	"booking_detail_id" int NOT NULL,
	"catering_id" int NOT NULL,
	"quantity" int NOT NULL CHECK("quantity" > 0),
	PRIMARY KEY("booking_catering_id")
);

CREATE INDEX "booking_detail_catering_index_0"
ON "booking_detail_catering" ("booking_detail_id");
CREATE INDEX "booking_detail_catering_index_1"
ON "booking_detail_catering" ("catering_id");
CREATE TABLE IF NOT EXISTS "network_packages" (
	"package_id" serial NOT NULL,
	"name" varchar(100) NOT NULL,
	"internet" varchar(50) NOT NULL,
	"server_installation" varchar(50) NOT NULL,
	"technical_info" text,
	PRIMARY KEY("package_id")
);


CREATE TABLE IF NOT EXISTS "booking_network" (
	"booking_network_id" serial NOT NULL,
	"booking_detail_id" int NOT NULL,
	"account_quantity" int NOT NULL,
	"package_id" int NOT NULL,
	"url" varchar(255),
	"port" varchar(255),
	"delivery_email" varchar(255),
	PRIMARY KEY("booking_network_id")
);

CREATE INDEX "booking_network_index_0"
ON "booking_network" ("booking_detail_id");
CREATE TABLE IF NOT EXISTS "booking_penalties" (
	"penalty_id" serial NOT NULL,
	"booking_detail_id" int NOT NULL,
	"tool_id" int,
	"description" varchar(255) NOT NULL,
	"quantity" int NOT NULL DEFAULT 1,
	"total_amount" decimal(10,2) NOT NULL,
	PRIMARY KEY("penalty_id")
);

CREATE INDEX "booking_penalties_index_0"
ON "booking_penalties" ("booking_detail_id");
CREATE INDEX "booking_penalties_index_1"
ON "booking_penalties" ("tool_id");
ALTER TABLE "cart_item"
ADD FOREIGN KEY("room_rate_id") REFERENCES "room_rate"("room_rate_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "cart_item"
ADD FOREIGN KEY("room_id") REFERENCES "room"("room_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "cart_item"
ADD FOREIGN KEY("cart_id") REFERENCES "cart"("cart_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "users"
ADD FOREIGN KEY("org_id") REFERENCES "organizations"("org_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "room"
ADD FOREIGN KEY("org_id") REFERENCES "organizations"("org_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "room"
ADD FOREIGN KEY("room_type_id") REFERENCES "room_type"("room_type_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "room_rate"
ADD FOREIGN KEY("room_id") REFERENCES "room"("room_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "cart"
ADD FOREIGN KEY("user_id") REFERENCES "users"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking"
ADD FOREIGN KEY("customer_id") REFERENCES "users"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking"
ADD FOREIGN KEY("staff_id") REFERENCES "users"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking_detail"
ADD FOREIGN KEY("booking_id") REFERENCES "booking"("booking_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking_detail"
ADD FOREIGN KEY("room_id") REFERENCES "room"("room_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "payment"
ADD FOREIGN KEY("booking_id") REFERENCES "booking"("booking_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking_detail_tools"
ADD FOREIGN KEY("booking_detail_id") REFERENCES "booking_detail"("booking_detail_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking_detail_tools"
ADD FOREIGN KEY("tool_id") REFERENCES "tools"("tool_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "tool_maintenance"
ADD FOREIGN KEY("tool_id") REFERENCES "tools"("tool_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "tool_maintenance"
ADD FOREIGN KEY("staff_id") REFERENCES "users"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking_detail_catering"
ADD FOREIGN KEY("booking_detail_id") REFERENCES "booking_detail"("booking_detail_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking_detail_catering"
ADD FOREIGN KEY("catering_id") REFERENCES "catering"("catering_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking_network"
ADD FOREIGN KEY("booking_detail_id") REFERENCES "booking_detail"("booking_detail_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking_network"
ADD FOREIGN KEY("package_id") REFERENCES "network_packages"("package_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking_penalties"
ADD FOREIGN KEY("booking_detail_id") REFERENCES "booking_detail"("booking_detail_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "booking_penalties"
ADD FOREIGN KEY("tool_id") REFERENCES "tools"("tool_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;