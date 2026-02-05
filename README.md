# Mosanada ERP System

**Mosanada ERP** is a modern, cloud-native Enterprise Resource Planning system designed for scalability, multi-tenancy, and modularity. Built with a focus on Accounting and Financial management, it serves as a robust platform for managing multiple business entities securely and efficiently.


---

## 🚀 Architecture

The system is built as a **Modular Monolith** with a clear separation of concerns, ensuring maintainability and ease of extension.

### Core Principles

1.  **Multi-Tenancy**: Strict data isolation at the database level using `companyId`. Every request is authenticated and scoped to a specific tenant.
2.  **Modularity**: Business logic (e.g., Accounting) is decoupled from the Core Platform (Auth, Tenancy). Modules can be activated or deactivated per company.
3.  **Security**: JWT-based authentication with robust middleware for tenant context injection and role-based access control.
4.  **Internationalization (i18n)**: Native API-level and Frontend-level support for English and Arabic (RTL).

### Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL, Prisma ORM
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Vanilla CSS (Enterprise Theme)
- **State Management**: React Context (Auth, Language)

---

## 🛠️ Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (running on a cloud instance like neno)
- **Git**

---

## 📦 Installation & Setup

Clone the repository and follow these steps to set up the environment.

### 1. Database Setup

Ensure your PostgreSQL database is running. Create a new database (e.g., `mosanada_db`).

### 2. Backend Configuration

Navigate to the backend directory and install dependencies.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# backend/.env
DATABASE_URL="postgresql://neondb_owner:npg_QF6eYDa8ElTX@ep-snowy-scene-ai7va0r3-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="supersecret_should_be_changed"
PORT=4000

```

Initialize the database schema:

```bash
npx prisma db push
```

Start the backend server:

```bash
npm run dev
# Server runs on http://localhost:4000
```

### 3. Frontend Configuration

Open a new terminal, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional for local, required for production):

```env
# frontend/.env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

Start the frontend development server:

```bash
npm run dev
# App runs on http://localhost:3000
```

---

## 🖥️ Usage Guide

1.  **Register a Company**:
    - Go to `http://localhost:3000/register`.
    - Enter Company Name, Admin Email, and Password.
    - _System Action_: Creates Company, Admin User, and activates the Accounting Module.
2.  **Login**:
    - Use the admin credentials to log in.
3.  **Dashboard**:
    - Access the Chart of Accounts to manage your ledger.
    - Post Journal Entries (Double-entry validation is enforced).
    - View the Trial Balance report.
4.  **Switch Language**:
    - Use the toggle button in the sidebar or header to switch between English and Arabic.

---

## 📂 Project Structure

```
├── backend/
│   ├── prisma/             # Database Schema
│   ├── src/
│   │   ├── core/           # Auth, Tenancy, Module System
│   │   ├── modules/        # Business Modules (Accounting)
│   │   ├── types/          # Type Definitions
│   │   ├── app.ts          # Express App Setup
│   │   └── server.ts       # Entry Point
│   └── package.json
│
├── frontend/
│   ├── public/             # Static Assets (Logo)
│   ├── src/
│   │   ├── app/            # Next.js App Router Pages
│   │   ├── components/     # Reusable UI Components
│   │   ├── lib/            # API & Context (i18n)
│   │   └── types/          # Frontend Types
│   └── package.json
│
└── README.md
```

---

## 🌐 API Documentation

### Authentication

- `POST /api/auth/register-company`: Register new tenant.
- `POST /api/auth/login`: Authenticate user.

### Accounting

- `GET /api/accounting/accounts`: List Chart of Accounts.
- `POST /api/accounting/accounts`: Create Account.
- `POST /api/accounting/journals`: Post Journal Entry.
- `GET /api/accounting/trial-balance`: Get Trial Balance Report.

---

## 🚀 Deployment

### Backend (Railway/Render)

1.  Push the `backend` folder to a GitHub repository.
2.  Connect Railway to the repo.
3.  Set Environment Variables (`DATABASE_URL`, `JWT_SECRET`).
4.  Deploy.

### Frontend (Vercel)

1.  Push the `frontend` folder to a GitHub repository.
2.  Import project into Vercel.
3.  Set Environment Variable: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com/api`.
4.  Deploy.

---

**© 2026 Mosanada ERP. All rights reserved.**
