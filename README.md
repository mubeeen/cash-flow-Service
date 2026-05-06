# 💰 Expense Tracker

A full stack expense tracking app built with Next.js 14, TypeScript, Prisma, PostgreSQL, and Tailwind CSS. Demonstrates all core Next.js patterns including SSR, SSG, ISR, CSR, API routes, middleware auth, and Docker deployment.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL 15
- **ORM:** Prisma 5
- **Styling:** Tailwind CSS
- **Auth:** Cookie-based sessions with bcrypt password hashing
- **Container:** Docker + Docker Compose

## Quick Start

### With Docker (one command)

```bash
docker compose up --build
```

Open http://localhost:3000

### Without Docker (development)

```bash
# Start PostgreSQL (requires Docker for DB only)
docker compose up db -d

# Install dependencies
npm install

# Run migrations
npx prisma migrate dev

# Seed sample data
node prisma/seed.js

# Start dev server
npm run dev -- -p 3001
```

Open http://localhost:3001

## Project Structure

```
src/
├── app/                              # Pages + API routes
│   ├── layout.tsx                    # Root layout with auth-aware navbar
│   ├── page.tsx                      # Home page
│   ├── error.tsx                     # Global error boundary
│   ├── not-found.tsx                 # 404 page
│   ├── globals.css                   # Tailwind imports
│   │
│   ├── login/page.tsx                # Login form (CSR)
│   ├── register/page.tsx             # Register form (CSR)
│   ├── about-us/page.tsx             # About page (SSG)
│   ├── dashboard/
│   │   ├── page.tsx                  # Spending totals (ISR, 60s)
│   │   └── loading.tsx               # Skeleton loader
│   ├── expenses/
│   │   ├── page.tsx                  # Expense list table (SSR)
│   │   ├── loading.tsx               # Skeleton loader
│   │   ├── new/page.tsx              # Add expense form (CSR)
│   │   └── [id]/
│   │       ├── page.tsx              # Expense detail (SSR)
│   │       ├── loading.tsx           # Skeleton loader
│   │       └── edit/page.tsx         # Edit expense form (CSR)
│   │
│   └── api/                          # Backend API routes
│       ├── auth/
│       │   ├── register/route.ts     # POST /api/auth/register
│       │   ├── login/route.ts        # POST /api/auth/login
│       │   └── logout/route.ts       # POST /api/auth/logout
│       ├── expenses/
│       │   ├── route.ts              # GET, POST /api/expenses
│       │   └── [id]/route.ts         # GET, PATCH, DELETE /api/expenses/:id
│       └── categories/
│           └── route.ts              # GET, POST /api/categories
│
├── components/                       # Reusable UI components
│   ├── DeleteButton.tsx              # Client component (onClick)
│   └── LogoutButton.tsx              # Client component (onClick)
│
├── lib/                              # Shared utilities
│   ├── db.ts                         # Prisma client singleton
│   ├── env.ts                        # Environment validation
│   └── types/                        # Contract types
│       ├── expense.types.ts
│       ├── category.types.ts
│       ├── api.types.ts
│       └── index.ts                  # Barrel export
│
├── middleware.ts                      # Auth middleware (protects routes)
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.js                       # Sample data
│   └── migrations/                   # Migration history
│
├── Dockerfile                        # Production container
├── docker-compose.yml                # PostgreSQL + App
└── .dockerignore
```

## Rendering Strategies

| Page | Strategy | How | Why |
|------|----------|-----|-----|
| `/` | SSG | Static, no data | Content never changes |
| `/about-us` | SSG | `force-static` | Content never changes |
| `/expenses` | SSR | `force-dynamic` | Needs fresh data every request |
| `/expenses/[id]` | SSR | Dynamic param | Can't cache, ID is variable |
| `/dashboard` | ISR | `revalidate = 60` | Totals don't need real-time updates |
| `/expenses/new` | CSR | `'use client'` | Form needs useState, onChange |
| `/expenses/[id]/edit` | CSR | `'use client'` | Form needs useState, onChange |
| `/login` | CSR | `'use client'` | Form with error handling |
| `/register` | CSR | `'use client'` | Form with error handling |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, sets session cookie |
| POST | /api/auth/logout | No | Clears session cookie |
| GET | /api/expenses | No | List all expenses |
| POST | /api/expenses | No | Create expense |
| GET | /api/expenses/:id | No | Get expense by ID |
| PATCH | /api/expenses/:id | No | Update expense |
| DELETE | /api/expenses/:id | No | Delete expense |
| GET | /api/categories | No | List categories |
| POST | /api/categories | No | Create category |

## Patterns Demonstrated

| Pattern | Where |
|---------|-------|
| File-based routing | Folder structure = URL structure |
| Server Components | expenses/page.tsx, dashboard/page.tsx |
| Client Components | expenses/new, login, register, DeleteButton |
| API Routes | app/api/ (REST endpoints) |
| Dynamic Routes | [id] folders for parameterized URLs |
| Middleware | src/middleware.ts (auth protection) |
| Loading States | loading.tsx per route (skeleton UI) |
| Error Boundaries | error.tsx (catch crashes gracefully) |
| Not Found | not-found.tsx (custom 404) |
| Contract Types | lib/types/ (shared input/output shapes) |
| Prisma ORM | Database queries, relations, migrations |
| Transactions | Checkout uses $transaction for atomicity |
| Cookie Auth | httpOnly session cookies with bcrypt |
| Env Validation | lib/env.ts (fail fast on missing vars) |
| Docker | Dockerfile + docker-compose for full deployment |

## Database Schema

```
User       → id, email, password (hashed), name
Category   → id, name
Expense    → id, item, price, date, categoryId (FK → Category)
```

## Built By

Muhammad Mubeen — Full Stack Engineer, Helsinki, Finland
