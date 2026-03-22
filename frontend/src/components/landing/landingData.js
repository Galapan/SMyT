import React from "react";
import {
  Shield,
  Car,
  Building2,
  Users,
  FileCheck,
  Database,
  Lock,
  TrendingUp,
  Truck,
  ClipboardList,
  FileText,
  Key,
} from "lucide-react";
import {
  SiReact,
  SiTailwindcss,
  SiFramer,
  SiReactrouter,
  SiVite,
  SiNodedotjs,
  SiExpress,
  SiPrisma,
  SiPostgresql,
  SiSupabase,
} from "react-icons/si";

const JwtIcon = (props) => React.createElement(Key, props);
const BcryptIcon = (props) => React.createElement(Lock, props);

export const roles = [
  {
    id: 'super-usuario',
    title: "Super Usuario",
    icon: Shield,
    description:
      "Acceso completo a todas las funcionalidades del sistema, administración de usuarios y configuración global.",
    permissions: [
      "Todos los módulos del sistema",
      "Gestión completa de usuarios",
      "Configuración global del sistema",
      "Auditorías y reportes completos",
      "Administración de depósitos y concesionarios",
    ],
  },
  {
    id: 'administrador-smyt',
    title: "Administrador SMyT",
    icon: Building2,
    description:
      "Gestión de depósitos, vehículos y auditorías a nivel estatal. Supervisión de operaciones.",
    permissions: [
      "Gestión de vehículos en depósitos",
      "Administración de concesionarios",
      "Auditorías de inventario",
      "Generación de reportes estatales",
      "Supervisión de operaciones",
    ],
  },
  {
    id: 'administrador-concesionario',
    title: "Administrador Concesionario",
    icon: Users,
    description:
      "Administración de inventario propio, registro de vehículos y gestión de solicitudes.",
    permissions: [
      "Registro de nuevos vehículos",
      "Gestión de inventario propio",
      "Solicitudes de edición de registros",
      "Consultas y búsquedas",
      "Carga de documentación digital",
    ],
  },
];

export const features = [
  {
    id: 'inventario',
    icon: Car,
    title: "Inventario Vehicular",
    description:
      "Registro completo en 4 pasos con inspección técnica y seguimiento legal.",
    details: [
      "Datos administrativos",
      "Especificaciones técnicas",
      "Inspección física",
      "Documentación digital",
    ],
  },
  {
    id: 'depositos',
    icon: Building2,
    title: "Depósitos y Concesionarios",
    description: "Control de capacidad, ubicación y cumplimiento normativo.",
    details: [
      "Gestión de capacidad",
      "Ubicaciones georreferenciadas",
      "Cumplimiento normativo",
      "Historial de operaciones",
    ],
  },
  {
    id: 'solicitudes',
    icon: FileCheck,
    title: "Sistema de Solicitudes",
    description:
      "Flujo de trabajo para modificaciones a registros vehiculares.",
    details: [
      "Solicitudes de edición",
      "Aprobaciones en cascada",
      "Trazabilidad completa",
      "Notificaciones automáticas",
    ],
  },
  {
    id: 'database',
    icon: Database,
    title: "Base de Datos Centralizada",
    description: "Información accesible y segura en tiempo real.",
    details: [
      "PostgreSQL con Supabase",
      "Respaldos automáticos",
      "Consultas optimizadas",
      "API RESTful",
    ],
  },
  {
    id: 'seguridad',
    icon: Lock,
    title: "Seguridad RBAC",
    description: "Control de acceso basado en roles con autenticación JWT.",
    details: [
      "Autenticación JWT",
      "Encriptación bcrypt",
      "Roles y permisos",
      "Sesiones seguras",
    ],
  },
  {
    id: 'auditorias',
    icon: TrendingUp,
    title: "Auditorías",
    description: "Seguimiento y verificación de operaciones del sistema.",
    details: [
      "Logs de actividad",
      "Reportes de auditoría",
      "Control de cambios",
      "Métricas de operación",
    ],
  },
];

export const systemModules = [
  {
    id: 'depositos',
    icon: Truck,
    title: "Gestión de Depósitos",
    description:
      "Administración completa de vehículos en depósitos vehiculares con control de capacidad, ubicación y estado legal.",
    features: [
      "Control de entrada/salida",
      "Capacidad en tiempo real",
      "Estado legal de vehículos",
      "Documentación digital",
    ],
  },
  {
    id: 'concesionarios',
    icon: Building2,
    title: "Concesionarios",
    description:
      "Registro y control de concesionarios autorizados para la venta y distribución de vehículos en el estado.",
    features: [
      "Registro de establecimientos",
      "Inventario autorizado",
      "Verificación de permisos",
      "Auditorías periódicas",
    ],
  },
  {
    id: 'registro',
    icon: ClipboardList,
    title: "Registro Vehicular",
    description:
      "Sistema de registro en 4 etapas con validación de datos administrativos, técnicos y de inspección física.",
    features: [
      "Datos administrativos",
      "Especificaciones técnicas",
      "Inspección física",
      "Carga de documentos",
    ],
  },
  {
    id: 'solicitudes',
    icon: FileText,
    title: "Solicitudes de Edición",
    description:
      "Flujo de trabajo para solicitar modificaciones a registros vehiculares ya capturados.",
    features: [
      "Creación de solicitudes",
      "Revisión por administrador",
      "Aprobación o rechazo",
      "Historial de cambios",
    ],
  },
];

export const stats = [
  { id: 'modules', number: "3", label: "Módulos Principales" },
  { id: 'stages', number: "4", label: "Etapas de Registro" },
  { id: 'roles', number: "3", label: "Roles de Usuario" },
  { id: 'availability', number: "24/7", label: "Disponibilidad" },
];

export const frontendStack = [
  {
    id: 'react',
    name: "React 19",
    Logo: SiReact,
    description: "Última versión con concurrent features",
  },
  { id: 'vite', name: "Vite", Logo: SiVite, description: "Build tool ultrarrápido" },
  {
    id: 'tailwind',
    name: "Tailwind CSS v4",
    Logo: SiTailwindcss,
    description: "Estilos utilitarios modernos",
  },
  { id: 'framer', name: "Framer Motion", Logo: SiFramer, description: "Animaciones fluidas" },
  {
    id: 'router',
    name: "React Router 7",
    Logo: SiReactrouter,
    description: "Navegación SPA",
  },
];

export const backendStack = [
  { id: 'node', name: "Node.js", Logo: SiNodedotjs, description: "Runtime JavaScript" },
  {
    id: 'express',
    name: "Express.js",
    Logo: SiExpress,
    description: "Framework web minimalista",
  },
  { id: 'prisma', name: "Prisma ORM", Logo: SiPrisma, description: "Type-safe ORM" },
  {
    id: 'postgres',
    name: "PostgreSQL",
    Logo: SiPostgresql,
    description: "Base de datos relacional",
  },
  { id: 'supabase', name: "Supabase", Logo: SiSupabase, description: "Backend as a Service" },
  { id: 'jwt', name: "JWT", Logo: JwtIcon, description: "Autenticación segura" },
  {
    id: 'bcrypt',
    name: "bcrypt.js",
    Logo: BcryptIcon,
    description: "Encriptación de contraseñas",
  },
];

export const accentColors = ["primary", "verde"];
export const bgAccentColors = ["bg-primary", "bg-verde"];

export const roleColors = [
  { accent: "azul", bg: "bg-azul" },
  { accent: "naranja", bg: "bg-naranja" },
  { accent: "verde", bg: "bg-verde" },
];
