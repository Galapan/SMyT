# SMyT Project - Context Guide

## Project Overview

**SMyT (Secretaría de Movilidad y Transporte)** is a comprehensive management platform for vehicle deposits, dealerships (concesionarios), and inventory auditing. The system digitizes and centralizes operations for government transportation authorities in Tlaxcala, Mexico.

### Core Features
- **Vehicle Inventory Management**: Multi-stage registration (4-step form), technical inspections, legal status tracking, digital file storage
- **Deposit & Dealership Administration**: Capacity monitoring, legal data management, compliance auditing
- **Role-Based Access Control (RBAC)**: Super Usuario, Administrador SMyT, Administrador Concesionario
- **Edit Request System**: Workflow for requesting changes to registered vehicle records

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, React Router 7, TanStack Query |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | PostgreSQL (Supabase), Supabase Auth & Storage |
| **Auth** | JWT, bcrypt.js |
| **Other** | Multer (uploads), node-cron, nodemailer |

## Project Structure

```
smyt-project/
├── backend/                    # Express API server
│   ├── controllers/            # Route controllers (auth, vehicles, users, uploads, solicitudes)
│   ├── routes/                 # API route definitions
│   ├── middleware/             # JWT auth middleware, role verification
│   ├── cron/                   # Scheduled jobs (account cleanup)
│   ├── prisma/                 # Database schema & migrations
│   ├── index.js                # Express app entry point
│   └── seed.js                 # Database seeding
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components (auth, common, dashboard)
│   │   ├── pages/              # Main application views
│   │   ├── layouts/            # Page layouts
│   │   ├── assets/             # Static assets & logos
│   │   └── utils/              # Utility functions
│   ├── index.html
│   └── vite.config.js
├── vercel.json                 # Vercel deployment configuration
└── package.json                # Root workspace scripts
```

## Building and Running

### Prerequisites
- Node.js (LTS version)
- Supabase project with PostgreSQL database
- Environment variables configured (see below)

### Environment Variables

Create `.env` files in `backend/` with:
```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-key
JWT_SECRET=your-secret-key
PORT=3000
```

### Development

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev          # Starts nodemon server on PORT
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev          # Starts Vite dev server
```

### Production Build

**From root:**
```bash
npm run build        # Builds frontend + generates Prisma client
```

**Individual builds:**
```bash
npm run build:frontend   # Frontend only
npm run build:backend    # Backend only (Prisma generate)
```

### Deployment

The project is configured for **Vercel** deployment via `vercel.json`:
- API routes (`/api/*`) → `backend/index.js`
- Static assets → `frontend/`
- SPA fallback → `frontend/index.html`

## Database Schema

Key models defined in `backend/prisma/schema.prisma`:

- **Usuario**: Users with roles (SUPER_USUARIO, ADMINISTRADOR, ADMINISTRADOR_CONCESIONARIO)
- **Deposito**: Vehicle deposit locations with capacity tracking
- **Vehiculo**: Complete vehicle records (administrative data, specs, legal status, physical inspection)
- **SolicitudEdicion**: Edit request workflow for vehicle records

## API Routes

| Route | Description |
|-------|-------------|
| `/api/auth` | Authentication (login, register, verify) |
| `/api/vehiculos` | Vehicle CRUD and inventory management |
| `/api/depositos` | Deposit location management |
| `/api/users` | User management |
| `/api/upload` | File upload handling |
| `/api/solicitudes` | Edit request workflow |

## Development Conventions

### Code Style
- **Frontend**: ES Modules (`"type": "module"` in package.json)
- **Backend**: CommonJS (`"type": "commonjs"` in package.json)
- **Linting**: ESLint with React Hooks and React Refresh plugins
- **Unused vars**: Prefix with `_` or use uppercase for React components

### Testing
No test framework currently configured. Test scripts are placeholders.

### Key Patterns
- JWT tokens for authentication with Bearer header format
- Role-based middleware (`requireRole()`) for access control
- Prisma Client for all database operations
- Supabase for file storage and external auth
- Framer Motion for animations throughout the UI
- Lucide React for icons

## Important Notes

1. **Never commit `.env` files** - Contains database credentials and API keys
2. **Prisma migrations** - Run `npx prisma migrate dev` after schema changes
3. **Prisma client** - Always run `npx prisma generate` after installing dependencies
4. **Account cleanup** - A cron job automatically handles inactive account cleanup (see `backend/cron/accountCleanup.js`)
