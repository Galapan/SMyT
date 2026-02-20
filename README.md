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
| **Frontend**      | React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React, React Router 7 |
| **Backend**       | Node.js, Express.js, Prisma ORM                                              |
| **Base de Datos** | PostgreSQL (Supabase), Supabase Auth & Storage                               |
| **Herramientas**  | JWT, Bcrypt.js, Multer, Day.js                                               |

---

## 🏗️ Arquitectura del Proyecto

El proyecto está organizado en una estructura monorepo para facilitar la sincronización entre capas:

```text
/
├── backend/                # API RESTful & Lógica de Negocio
│   ├── controllers/        # Controladores de rutas
│   ├── routes/             # Definición de endpoints
│   ├── prisma/             # Schema y migraciones de base de datos
│   └── middleware/         # Validaciones y Auth (JWT)
├── frontend/               # Interfaz de Usuario (SPA)
│   ├── src/
│   │   ├── components/     # Componentes reutilizables y UI
│   │   ├── pages/          # Vistas principales de la aplicación
│   │   ├── assets/         # Recursos estáticos y logotipos
│   │   └── hooks/          # Lógica compartida
└── README.md
```

---

## 🚥 Instalación y Configuración

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

Configure su archivo `.env` basándose en las variables requeridas:

- `DATABASE_URL`: Conexión de Prisma con PostgreSQL.
- `DIRECT_URL`: Conexión directa para migraciones.
- `SUPABASE_URL` & `SUPABASE_SERVICE_KEY`: Para gestión de archivos y auth.

**Sincronizar base de datos:**

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 3. Configuración del Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 📉 Modelo de Datos

El sistema utiliza un esquema relacional optimizado que incluye:

- **Usuarios**: Identidad y roles.
- **Depósitos**: Ubicaciones físicas y capacidades.
- **Vehículos**: Datos técnicos, legales e inspecciones.
- **Solicitudes de Edición**: Trazabilidad de cambios en expedientes.

---

## 🏛️ Identidad Institucional

El sistema integra la identidad visual oficial del **Gobierno de Tlaxcala** y la **Secretaría de Movilidad y Transporte**, asegurando una experiencia profesional y oficial para los usuarios finales.

---

© 2025 SMyT - Sistema Integral de Gestión. Todos los derechos reservados.
