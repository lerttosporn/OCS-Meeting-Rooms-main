# OCS Meeting Rooms

A full-stack web application for managing and booking meeting rooms. Built with **NestJS** (backend) and **React + Vite** (frontend), backed by **PostgreSQL**.

> Original design: [Figma – OCS Meeting Rooms](https://www.figma.com/design/InTWYh3D0dBJezS4LVemjn/OCS-Meeting-Rooms)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Test Accounts](#test-accounts)
3. [Project Structure](#project-structure)
4. [Database Setup](#database-setup)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Environment Variables](#environment-variables)
8. [Available Scripts](#available-scripts)
9. [Default Ports](#default-ports)

---

## Prerequisites

Make sure the following tools are installed on your machine before you begin:

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | >= 18.x | Runtime for both backend and frontend |
| [npm](https://www.npmjs.com/) | >= 9.x | Package manager |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Latest | Run PostgreSQL database locally |
| [Git](https://git-scm.com/) | Latest | Clone the repository |

---

## Project Structure

```
OCS-Meeting-Rooms/
├── backend/          # NestJS REST API (runs on port 3001)
│   ├── src/
│   │   ├── database/ # SQL schema, seed data, and DB setup scripts
│   │   └── ...       # Feature modules (bookings, rooms, users, etc.)
│   ├── docker-compose.yml
│   └── .env
└── frontend/         # React + Vite SPA (runs on port 3000)
    └── src/
```

---

## Database Setup

The project uses **PostgreSQL 15** managed via Docker.

**1. Start the PostgreSQL container:**

```bash
cd backend
docker compose up -d
```

This starts a PostgreSQL instance with:
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `OCS_meeting`
- **Username:** `admin`
- **Password:** `mysecretpassword`

**2. Create the database schema:**

```bash
npm run db:setup
```

**3. (Optional) Seed the database with sample data:**

```bash
npm run db:seed
```

> **Note:** Run `db:setup` only once. Re-running it will **drop and recreate** all tables.

---

## Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Copy the environment file (see Environment Variables section below)
#    Make sure .env exists and is correctly configured

# 4. Start the development server
npm run start:dev
```

The API will be available at **http://localhost:3001**

**Swagger API Docs:** http://localhost:3001/api

---

## Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

---

## Environment Variables

The backend requires a `.env` file inside the `backend/` directory.  
A working default for local development:

```env
# backend/.env

# Port the NestJS server listens on
PORT=3001

# PostgreSQL connection URL for the application database
DB_URL=postgresql://admin:mysecretpassword@localhost:5432/OCS_meeting

# PostgreSQL connection URL used for admin-level DB operations (e.g., schema setup)
ADMIN_DB_URL=postgresql://admin:mysecretpassword@localhost:5432/postgres

# Secret key used to sign and verify JWT tokens — change this in production
JWT_SECRET=ocs-super-secret-jwt-key-2025
```

> **Important:** Never commit real secrets to version control. The values above are for local development only.

---

## Available Scripts

### Backend (`/backend`)

| Script | Command | Description |
|--------|---------|-------------|
| Start dev server | `npm run start:dev` | Run with hot-reload |
| Build | `npm run build` | Compile TypeScript to `/dist` |
| Start production | `npm run start:prod` | Run compiled build |
| Create DB schema | `npm run db:setup` | Drops and recreates all tables |
| Seed DB | `npm run db:seed` | Inserts sample data |
| Lint | `npm run lint` | Run ESLint with auto-fix |
| Format | `npm run format` | Run Prettier |
| Tests | `npm run test` | Run unit tests |

### Frontend (`/frontend`)

| Script | Command | Description |
|--------|---------|-------------|
| Start dev server | `npm run dev` | Run Vite dev server on port 3000 |
| Build | `npm run build` | Bundle for production into `/build` |

---

## Default Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend (React) | 3000 | http://localhost:3000 |
| Backend (NestJS) | 3001 | http://localhost:3001 |
| Swagger Docs | 3001 | http://localhost:3001/api |
| PostgreSQL | 5432 | localhost:5432 |

---

## Test Accounts

After running `npm run db:seed`, the following accounts are available for local testing.
All accounts belong to the organization **บริษัท OCS จำกัด** (`OCS001`).

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **customer** | `customer@ocs.com` | `customer123` | Browse rooms, create bookings, manage cart |
| **admin** | `admin@ocs.com` | `admin123` | Full system access — manage rooms, users, bookings |
| **staff_tech** | `staff@ocs.com` | `staff123` | Manage tools, view maintenance records |
| **financial** | `financial@ocs.com` | `financial123` | View and manage payments, receipts, and financial records |