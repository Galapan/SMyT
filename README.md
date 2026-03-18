# 🚍 Sistema Integral de Gestión - SMyT

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-green?logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-black?logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

Plataforma integral diseñada para la Secretaría de Movilidad y Transporte (SMyT) destinada a la **digitalización, control y auditoría de depósitos vehiculares, concesionarios y gestión de inventarios**. Este sistema centraliza la operación administrativa y técnica, asegurando el cumplimiento normativo y la transparencia en cada proceso.

---

## 🔥 Características Principales

### 📋 Gestión de Inventario Vehicular

- **Registro Multietapa**: Formulario dinámico de 4 pasos (Datos Administrativos, Vehículo, Estatus Legal e Inspección Física).
- **Inspección Técnica**: Control detallado de estado de carrocería, mecánica, interior y sistemas.
- **Cumplimiento Ambiental**: Registro crítico de drenado de líquidos y estado de bolsas de aire.
- **Expediente Digital**: Almacenamiento de documentos adjuntos y galería de fotos por vehículo.

### 🏢 Administración de Depósitos y Concesionarios

- **Control de Capacidad**: Monitoreo de cupo máximo por depósito.
- **Datos Legales**: Gestión de RFC, representantes y contactos operativos.
- **Auditoría**: Sistema de revisión de concesionarios con visualización de estatus y cumplimiento.

### 🔐 Seguridad y Roles (RBAC)

- **Super Usuario**: Control total del sistema.
- **Administrador SMyT**: Supervisión de depósitos y gestión de solicitudes de edición.
- **Usuario Concesionario**: Operación diaria de registros y salidas de vehículos.

### 📧 Sistema de Solicitudes

- Flujo de solicitudes para la edición de expedientes ya registrados, permitiendo un control estricto sobre la integridad de los datos originales.

---

## 🛠️ Stack Tecnológico

| Capa              | Tecnologías                                                                  |
| :---------------- | :--------------------------------------------------------------------------- |
| **Frontend**      | React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React, React Router 7, TanStack Query |
| **Backend**       | Node.js, Express.js, Prisma ORM                                              |
| **Base de Datos** | PostgreSQL (Supabase), Supabase Auth & Storage                               |
| **Herramientas**  | JWT, Bcrypt.js, Multer, Day.js, node-cron, nodemailer                        |

---

## 🏗️ Arquitectura del Proyecto

El proyecto está organizado en una estructura monorepo para facilitar la sincronización entre capas:

```text
smyt-project/
├── backend/
│   ├── controllers/        # Controladores de rutas (auth, vehicles, users, uploads, solicitudes)
│   ├── routes/             # Definición de endpoints API
│   ├── middleware/         # Validaciones y Auth (JWT, roles)
│   ├── cron/               # Tareas programadas (limpieza de cuentas)
│   ├── prisma/             # Schema y migraciones de base de datos
│   ├── index.js            # Entry point del servidor Express
│   └── seed.js             # Seed inicial de datos
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables (auth, common, dashboard)
│   │   ├── pages/          # Vistas principales de la aplicación
│   │   ├── layouts/        # Layouts de páginas
│   │   ├── assets/         # Recursos estáticos y logotipos
│   │   └── utils/          # Funciones utilitarias
│   ├── index.html
│   └── vite.config.js
├── vercel.json             # Configuración de deployment en Vercel
└── package.json            # Scripts del workspace raíz
```

---

## 🚥 Instalación y Configuración

### Prerrequisitos

- Node.js (versión LTS recomendada)
- Proyecto de Supabase configurado con PostgreSQL
- Variables de entorno configuradas (ver abajo)

### 1. Clonar el repositorio

```bash
git clone https://github.com/Galapan/SMyT.git
cd smyt-project
```

### 2. Configuración del Backend

```bash
cd backend
npm install
```

**Crear archivo `.env` en `backend/`:**

```env
# Base de datos (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# Supabase (Storage & Auth)
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_SERVICE_KEY=[TU_SERVICE_KEY]

# Autenticación JWT
JWT_SECRET=tu-secreto-seguro-cambiar-en-produccion

# Servidor
PORT=3000
NODE_ENV=development
```

> ⚠️ **Importante**: Nunca hagas commit del archivo `.env`. Este archivo contiene credenciales sensibles.

**Generar cliente Prisma y aplicar migraciones:**

```bash
npx prisma generate
npx prisma migrate dev
```

**Iniciar servidor de desarrollo:**

```bash
npm run dev
```

El servidor correrá en `http://localhost:3000`

### 3. Configuración del Frontend

```bash
cd ../frontend
npm install
```

**Iniciar servidor de desarrollo:**

```bash
npm run dev
```

La aplicación frontend correrá en `http://localhost:5173` (por defecto con Vite)

---

## 📦 Comandos Disponibles

### Desde el raíz del proyecto

```bash
npm run build          # Build completo (frontend + backend)
npm run build:frontend # Build solo del frontend
npm run build:backend  # Build solo del backend (Prisma generate)
```

### Desde `backend/`

```bash
npm run dev            # Servidor de desarrollo con nodemon
npm run start          # Servidor en producción
npx prisma generate    # Generar cliente Prisma
npx prisma migrate dev # Aplicar migraciones en desarrollo
npx prisma studio      # Abrir Prisma Studio (GUI de base de datos)
```

### Desde `frontend/`

```bash
npm run dev            # Servidor de desarrollo con Vite
npm run build          # Build de producción
npm run preview        # Preview del build en producción
npm run lint           # Ejecutar ESLint
```

---

## 📉 Modelo de Datos

El sistema utiliza un esquema relacional optimizado definido en `backend/prisma/schema.prisma`:

| Modelo | Descripción |
|--------|-------------|
| **Usuario** | Usuarios con roles (SUPER_USUARIO, ADMINISTRADOR, ADMINISTRADOR_CONCESIONARIO) |
| **Deposito** | Ubicaciones físicas de vehículos con control de capacidad |
| **Vehiculo** | Registros completos (datos administrativos, specs, estatus legal, inspección física) |
| **SolicitudEdicion** | Flujo de trabajo para solicitudes de cambios en expedientes |

---

## 🔌 API Endpoints

| Ruta | Descripción |
|------|-------------|
| `GET /api/auth/*` | Autenticación (login, registro, verificación) |
| `GET /api/vehiculos/*` | CRUD de vehículos y gestión de inventario |
| `GET /api/depositos/*` | Gestión de depósitos vehiculares |
| `GET /api/users/*` | Administración de usuarios |
| `POST /api/upload/*` | Subida de archivos y documentos |
| `GET /api/solicitudes/*` | Flujo de solicitudes de edición |

---

## 🚀 Deployment en Vercel

El proyecto está configurado para deployment en Vercel mediante `vercel.json`:

- Rutas API (`/api/*`) → `backend/index.js`
- Assets estáticos → `frontend/`
- SPA fallback → `frontend/index.html`

**Deploy:**

```bash
vercel
```

Asegúrate de configurar las variables de entorno en el dashboard de Vercel antes de desplegar.

---

## 🏛️ Identidad Institucional

El sistema integra la identidad visual oficial del **Gobierno de Tlaxcala** y la **Secretaría de Movilidad y Transporte**, asegurando una experiencia profesional y oficial para los usuarios finales.

---

## 📝 Notas Importantes

1. **Variables de entorno**: Nunca hagas commit de archivos `.env`
2. **Migraciones Prisma**: Ejecuta `npx prisma migrate dev` después de cambios en el schema
3. **Cliente Prisma**: Siempre ejecuta `npx prisma generate` después de instalar dependencias
4. **Limpieza de cuentas**: Un cron job maneja automáticamente la limpieza de cuentas inactivas

---

© 2025 SMyT - Sistema Integral de Gestión. Todos los derechos reservados.
