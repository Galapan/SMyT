Sistema Integral de Gestión - SMyT
Plataforma web desarrollada para la gestión, control y auditoría de vehículos, concesionarios y depósitos para la Secretaría de Movilidad y Transporte. El proyecto está dividido en dos aplicaciones principales: una API RESTful para el backend y una interfaz de usuario interactiva para el frontend.

Tecnologías Principales
Frontend: React.js, Vite, Tailwind CSS.

Backend: Node.js, Express.js.

Base de Datos / ORM: Prisma, PostgreSQL (Supabase).

Estructura del Proyecto
El repositorio está organizado en dos directorios principales:

/backend: Contiene la lógica de negocio, configuración de base de datos, rutas (autenticación, vehículos, depósitos, solicitudes) y controladores.

/frontend: Contiene la interfaz de usuario, componentes de React, vistas de administrador y configuración de estilos.

Requisitos Previos
Asegúrese de tener instalados los siguientes componentes en su entorno de desarrollo local:

Node.js (v16 o superior)

npm (v7 o superior)

Acceso a la base de datos de PostgreSQL/Supabase.

Instalación y Configuración
Siga estos pasos para ejecutar el proyecto en un entorno de desarrollo local.

1. Configuración del Backend
   Navegue al directorio del backend:

Bash
cd backend
Instale las dependencias del proyecto:

Bash
npm install
Cree un archivo .env en la raíz de la carpeta backend y configure las variables de entorno necesarias (ej. DATABASE_URL, JWT_SECRET).

Ejecute las migraciones y genere el cliente de Prisma:

Bash
npx prisma generate
npx prisma migrate dev
Inicie el servidor de desarrollo:

Bash
npm run dev
El backend se ejecutará por defecto en el puerto configurado en sus variables de entorno.

2. Configuración del Frontend
   Abra una nueva terminal y navegue al directorio del frontend:

Bash
cd frontend
Instale las dependencias del proyecto:

Bash
npm install
Cree un archivo .env en la raíz de la carpeta frontend y establezca las variables necesarias (ej. la URL de la API del backend, como VITE_API_URL).

Inicie la aplicación de React:

Bash
npm run dev
La interfaz estará disponible habitualmente en http://localhost:5173.

Uso del Sistema
Una vez que ambas partes del sistema estén en ejecución:

Acceda a la URL del frontend desde su navegador web.

Utilice credenciales válidas para iniciar sesión a través del módulo de autenticación.

Dependiendo de su rol, tendrá acceso a los paneles de administración, registro de vehículos, gestión de depósitos vehiculares y herramientas de auditoría de concesionarios.
