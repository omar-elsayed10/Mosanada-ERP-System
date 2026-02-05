# Mini Multi-Tenant ERP with Accounting Module

A modular, multi-tenant ERP system built with Node.js, Express, Prisma, and Next.js.

## Features

- **Multi-Tenancy**: Data isolation by Company ID.
- **Authentication**: JWT-based auth with company registration.
- **Internationalization**: Full English/Arabic support with RTL layout.
- **Accounting Module**:
  - Chart of Accounts (Asset, Liability, Equity, Revenue, Expense)
  - Journal Entries (Double-entry bookkeeping validation)
  - Trial Balance Report
  - Auto-Journals for Invoices and Payments

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend**: Next.js (App Router), TypeScript, Local State
- **Database**: PostgreSQL

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database

### Backend Setup

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env`:
   - Copy `.env.example` to `.env` (or create one)
   - Set `DATABASE_URL` (e.g., `postgresql://user:password@localhost:5432/erp_db`)
   - Set `JWT_SECRET`
4. Run Migrations:
   ```bash
   npx prisma db push
   ```
5. Start Server:
   ```bash
   npx ts-node src/server.ts
   ```
   Server runs on `http://localhost:4000`.

### Frontend Setup

1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Dev Server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:3000`.

## API Examples

### Register Company

**POST** `/api/auth/register-company`

```json
{
  "companyName": "Tech Corp",
  "email": "admin@tech.com",
  "password": "password123"
}
```

### Create Journal Entry

**POST** `/api/accounting/journals`
Headers: `Authorization: Bearer <token>`

```json
{
  "description": "Initial Investment",
  "date": "2023-10-01",
  "lines": [
    { "accountId": "<bank_id>", "debit": 1000, "credit": 0 },
    { "accountId": "<equity_id>", "debit": 0, "credit": 1000 }
  ]
}
```
