import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Car, Building2, Users, FileCheck, Database,
  Lock, TrendingUp, CheckCircle2, ArrowRight, Menu, X, Clock,
  Truck, ClipboardList, FileText, MapPin, Key, ChevronRight
} from 'lucide-react';
import {
  SiReact, SiTailwindcss, SiFramer, SiReactrouter, SiVite,
  SiNodedotjs, SiExpress, SiPrisma, SiPostgresql, SiSupabase
} from 'react-icons/si';
import LogoSMyT from '../assets/logo_smyt.png';
import LogoTlax from '../assets/LogoTlax.png';

// Wrapper components for lucide icons to use currentColor
const JwtIcon = (props) => <Key {...props} />;
const BcryptIcon = (props) => <Lock {...props} />;

// ─── Data ────────────────────────────────────────────────────────────────────

const roles = [
  {
    title: 'Super Usuario',
    icon: Shield,
    description: 'Acceso completo a todas las funcionalidades del sistema, administración de usuarios y configuración global.',
    permissions: [
      'Todos los módulos del sistema',
      'Gestión completa de usuarios',
      'Configuración global del sistema',
      'Auditorías y reportes completos',
      'Administración de depósitos y concesionarios'
    ]
  },
  {
    title: 'Administrador SMyT',
    icon: Building2,
    description: 'Gestión de depósitos, vehículos y auditorías a nivel estatal. Supervisión de operaciones.',
    permissions: [
      'Gestión de vehículos en depósitos',
      'Administración de concesionarios',
      'Auditorías de inventario',
      'Generación de reportes estatales',
      'Supervisión de operaciones'
    ]
  },
  {
    title: 'Administrador Concesionario',
    icon: Users,
    description: 'Administración de inventario propio, registro de vehículos y gestión de solicitudes.',
    permissions: [
      'Registro de nuevos vehículos',
      'Gestión de inventario propio',
      'Solicitudes de edición de registros',
      'Consultas y búsquedas',
      'Carga de documentación digital'
    ]
  }
];

const features = [
  {
    icon: Car,
    title: 'Inventario Vehicular',
    description: 'Registro completo en 4 pasos con inspección técnica y seguimiento legal.',
    details: ['Datos administrativos', 'Especificaciones técnicas', 'Inspección física', 'Documentación digital']
  },
  {
    icon: Building2,
    title: 'Depósitos y Concesionarios',
    description: 'Control de capacidad, ubicación y cumplimiento normativo.',
    details: ['Gestión de capacidad', 'Ubicaciones georreferenciadas', 'Cumplimiento normativo', 'Historial de operaciones']
  },
  {
    icon: FileCheck,
    title: 'Sistema de Solicitudes',
    description: 'Flujo de trabajo para modificaciones a registros vehiculares.',
    details: ['Solicitudes de edición', 'Aprobaciones en cascada', 'Trazabilidad completa', 'Notificaciones automáticas']
  },
  {
    icon: Database,
    title: 'Base de Datos Centralizada',
    description: 'Información accesible y segura en tiempo real.',
    details: ['PostgreSQL con Supabase', 'Respaldos automáticos', 'Consultas optimizadas', 'API RESTful']
  },
  {
    icon: Lock,
    title: 'Seguridad RBAC',
    description: 'Control de acceso basado en roles con autenticación JWT.',
    details: ['Autenticación JWT', 'Encriptación bcrypt', 'Roles y permisos', 'Sesiones seguras']
  },
  {
    icon: TrendingUp,
    title: 'Auditorías',
    description: 'Seguimiento y verificación de operaciones del sistema.',
    details: ['Logs de actividad', 'Reportes de auditoría', 'Control de cambios', 'Métricas de operación']
  }
];

const systemModules = [
  {
    icon: Truck,
    title: 'Gestión de Depósitos',
    description: 'Administración completa de vehículos en depósitos vehiculares con control de capacidad, ubicación y estado legal.',
    features: ['Control de entrada/salida', 'Capacidad en tiempo real', 'Estado legal de vehículos', 'Documentación digital']
  },
  {
    icon: Building2,
    title: 'Concesionarios',
    description: 'Registro y control de concesionarios autorizados para la venta y distribución de vehículos en el estado.',
    features: ['Registro de establecimientos', 'Inventario autorizado', 'Verificación de permisos', 'Auditorías periódicas']
  },
  {
    icon: ClipboardList,
    title: 'Registro Vehicular',
    description: 'Sistema de registro en 4 etapas con validación de datos administrativos, técnicos y de inspección física.',
    features: ['Datos administrativos', 'Especificaciones técnicas', 'Inspección física', 'Carga de documentos']
  },
  {
    icon: FileText,
    title: 'Solicitudes de Edición',
    description: 'Flujo de trabajo para solicitar modificaciones a registros vehiculares ya capturados.',
    features: ['Creación de solicitudes', 'Revisión por administrador', 'Aprobación o rechazo', 'Historial de cambios']
  }
];

const stats = [
  { number: '3', label: 'Módulos Principales' },
  { number: '4', label: 'Etapas de Registro' },
  { number: '3', label: 'Roles de Usuario' },
  { number: '24/7', label: 'Disponibilidad' }
];

const frontendStack = [
  { name: 'React 19',       Logo: SiReact,       description: 'Última versión con concurrent features' },
  { name: 'Vite',           Logo: SiVite,        description: 'Build tool ultrarrápido' },
  { name: 'Tailwind CSS v4',Logo: SiTailwindcss, description: 'Estilos utilitarios modernos' },
  { name: 'Framer Motion',  Logo: SiFramer,      description: 'Animaciones fluidas' },
  { name: 'React Router 7', Logo: SiReactrouter, description: 'Navegación SPA' }
];

const backendStack = [
  { name: 'Node.js',    Logo: SiNodedotjs,  description: 'Runtime JavaScript' },
  { name: 'Express.js', Logo: SiExpress,    description: 'Framework web minimalista' },
  { name: 'Prisma ORM', Logo: SiPrisma,     description: 'Type-safe ORM' },
  { name: 'PostgreSQL', Logo: SiPostgresql, description: 'Base de datos relacional' },
  { name: 'Supabase',   Logo: SiSupabase,   description: 'Backend as a Service' },
  { name: 'JWT',        Logo: JwtIcon,      description: 'Autenticación segura' },
  { name: 'bcrypt.js',  Logo: BcryptIcon,   description: 'Encriptación de contraseñas' }
];

// ─── Animation Variants ──────────────────────────────────────────────────────

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    // Stagger más corto para que la sección "termine" rápido
    transition: { staggerChildren: 0.045, delayChildren: 0 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// Viewport settings reutilizables
// Disparar un poco antes al entrar al viewport (evita sensación "tarde")
const vp = { once: true, amount: 0.18, margin: '0px 0px -15% 0px' };

// ─── Section Header helper ────────────────────────────────────────────────────

function SectionHeader({ label, title, description }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={vp}
      className="mb-12"
    >
      <motion.p variants={fadeUp} className="text-sm font-medium text-primary mb-2">
        {label}
      </motion.p>
      <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
        {title}
      </motion.h2>
      {description && (
        <motion.p variants={fadeUp} className="text-gray-500 max-w-xl leading-relaxed">
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

// ─── Components ──────────────────────────────────────────────────────────────

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prevOverflow;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    document.body.style.overflow = '';
    const element = document.querySelector(href);
    if (element) {
      setTimeout(() => {
        const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }, 50);
    }
  };

  const navLinks = [
    { href: '#inicio',        label: 'Inicio' },
    { href: '#modulos',       label: 'Módulos' },
    { href: '#caracteristicas', label: 'Características' },
    { href: '#roles',         label: 'Roles' },
    { href: '#tecnologia',    label: 'Tecnología' }
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    show: { 
      opacity: 1, 
      height: 'auto', 
      y: 0,
      transition: { 
        duration: 0.3, 
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.08,
        delayChildren: 0.1
      } 
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      y: -10,
      transition: { 
        duration: 0.25, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      } 
    }
  };

  const mobileLinkVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isOpen 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200'
            : scrolled 
              ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20' 
              : 'bg-white/70 backdrop-blur-lg border-b border-white/10'
        }`}
      >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LogoTlax} alt="Gobierno de Tlaxcala" className="h-9 w-9 object-contain md:hidden" />
            <img
              src={LogoSMyT}
              alt="SMyT"
              className="hidden md:block h-8 lg:h-9 w-auto object-contain"
            />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-gray-500 hover:text-primary text-sm transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <button
            onClick={() => navigate('/login')}
            className="hidden md:block bg-primary hover:opacity-90 px-5 py-2 rounded-lg text-white text-sm font-medium transition-opacity shadow-md shadow-primary/20"
          >
            Iniciar Sesión
          </button>

          <button className="md:hidden text-gray-600 p-1" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="md:hidden relative mt-4 pb-2 flex flex-col gap-1 overflow-hidden"
              style={{ zIndex: 50 }}
            >
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  variants={mobileLinkVariants}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="group text-gray-500 hover:text-primary hover:bg-gray-50 text-sm py-2.5 px-3 rounded-lg transition-colors relative"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-3 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-10" />
                </motion.a>
              ))}
              <motion.button
                variants={mobileLinkVariants}
                onClick={() => { navigate('/login'); setIsOpen(false); }}
                className="mt-2 bg-primary px-5 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
              >
                Iniciar Sesión
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
    </>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 500], [0, -70]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);

  // Hero text animates in on load (not scroll-triggered)
  const heroStagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center bg-white pt-16 overflow-hidden">
      <motion.div
        style={{ y, opacity }}
        className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 will-change-transform"
      >
        {/* Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center items-center gap-4 mb-10"
        >
          <img src={LogoTlax} alt="Gobierno de Tlaxcala" className="h-16 w-16 object-contain" />
          <div className="h-8 w-px bg-gray-200" />
          <img src={LogoSMyT} alt="SMyT" className="h-10 w-auto object-contain" />
        </motion.div>

        {/* Staggered content */}
        <motion.div variants={heroStagger} initial="hidden" animate="show">
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 mb-8"
          >
            <span className="w-2 h-2 bg-verde rounded-full" />
            <span className="text-sm text-gray-500">Plataforma Oficial · Gobierno de Tlaxcala</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight leading-tight"
          >
            Secretaría de{' '}
            <span className="text-primary">Movilidad y Transporte</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-gray-400 mb-3">
            Tlaxcala, México
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Plataforma integral para la gestión de depósitos vehiculares,
            concesionarios y auditoría de inventarios.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button
              onClick={() => navigate('/login')}
              className="group bg-primary hover:opacity-90 px-7 py-3 rounded-lg text-white font-medium transition-opacity inline-flex items-center gap-2"
            >
              Acceder al Sistema
              <ArrowRight className="group-hover:translate-x-0.5 transition-transform" size={17} />
            </button>
            <motion.a
              href="#modulos"
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector('#modulos');
                if (element) {
                  const offsetTop = element.offsetTop - 80;
                  window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
              }}
              whileHover={{ y: -1 }}
              className="text-gray-500 hover:text-primary text-sm font-medium inline-flex items-center gap-1 transition-colors"
            >
              Conocer más <ChevronRight size={16} />
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={scaleIn}
            className="grid grid-cols-2 md:grid-cols-4 border border-gray-200 rounded-2xl overflow-hidden divide-x divide-y md:divide-y-0 divide-gray-200"
          >
            {stats.map((stat, i) => (
              <div key={i} className="bg-white py-6 px-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.number}</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ModulesSection() {
  return (
    <section id="modulos" className="py-24 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Módulos del Sistema"
          title="Funcionalidades Completas"
          description="Cuatro módulos principales para cubrir todas las necesidades operativas."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid md:grid-cols-2 gap-5"
        >
          {systemModules.map((module, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <module.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{module.description}</p>
              <ul className="space-y-1.5">
                {module.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-verde flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="caracteristicas" className="py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Características"
          title="Todo lo que Necesitas"
          description="Funcionalidades completas para la administración vehicular estatal."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{feature.description}</p>
              <ul className="space-y-1.5">
                {feature.details.map((detail, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-1 h-1 bg-primary/50 rounded-full flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function RolesSection() {
  return (
    <section id="roles" className="py-24 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Roles y Permisos"
          title="Control de Acceso RBAC"
          description="Sistema de roles jerárquico para seguridad y organización óptima."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid lg:grid-cols-3 gap-5"
        >
          {roles.map((role, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <role.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{role.title}</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{role.description}</p>
              <ul className="space-y-2">
                {role.permissions.map((permission, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-verde flex-shrink-0 mt-0.5" />
                    {permission}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TechStackSection() {
  return (
    <section id="tecnologia" className="py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Stack Tecnológico"
          title="Tecnología Moderna"
          description="Stack de última generación para una plataforma rápida, segura y escalable."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {[...frontendStack, ...backendStack].map((tech, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: fadeUp.hidden,
                show: fadeUp.show,
                hover: { y: -6, scale: 1.06 }
              }}
              whileHover="hover"
              transition={{ type: 'spring', stiffness: 420, damping: 22, mass: 0.6 }}
              className="group relative flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/60 hover:border-gray-400 transition-colors duration-200 overflow-hidden"
            >
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-gray-900/5 blur-2xl" />
              </motion.div>

              <motion.div
                variants={{ hidden: { rotate: 0, scale: 1 }, show: { rotate: 0, scale: 1 }, hover: { rotate: -6, scale: 1.06 } }}
                transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                className="w-11 h-11 flex items-center justify-center text-gray-400 group-hover:text-gray-800 transition-colors duration-200"
              >
                <tech.Logo size={40} className="w-full h-full drop-shadow-sm" />
              </motion.div>

              <span className="text-xs font-semibold text-gray-600 text-center group-hover:text-gray-900 transition-colors duration-200">
                {tech.name}
              </span>

              <AnimatePresence>
                <motion.p
                  key="desc"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-[11px] leading-snug text-gray-500 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  {tech.description}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            ¿Listo para comenzar?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 mb-8 leading-relaxed">
            Accede a la plataforma SMyT para gestionar vehículos, depósitos y concesionarios
            de manera eficiente y segura.
          </motion.p>
          <motion.div variants={fadeUp}>
            <button
              onClick={() => navigate('/login')}
              className="group bg-primary hover:opacity-90 px-7 py-3 rounded-lg text-white font-medium transition-opacity inline-flex items-center gap-2"
            >
              Iniciar Sesión
              <ArrowRight className="group-hover:translate-x-0.5 transition-transform" size={17} />
            </button>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400"
          >
            {['Acceso seguro', 'Soporte 24/7', 'Actualizaciones constantes'].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-verde" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={vp}
      className="py-12 px-4 sm:px-6 bg-white border-t border-gray-100"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={LogoTlax} alt="Gobierno de Tlaxcala" className="h-8 w-8 object-contain md:hidden" />
              <img
                src={LogoSMyT}
                alt="SMyT"
                className="hidden md:block h-7 lg:h-8 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Plataforma oficial para la gestión vehicular del estado de Tlaxcala.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Navegación</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: '#inicio',          label: 'Inicio' },
                { href: '#modulos',         label: 'Módulos' },
                { href: '#caracteristicas', label: 'Características' },
                { href: '#roles',           label: 'Roles' },
                { href: '#tecnologia',      label: 'Tecnología' }
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-primary transition-colors w-fit"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Contacto</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Tlaxcala, México
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4 flex-shrink-0" />
                Lunes a Viernes 9:00 – 18:00
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400 text-center sm:text-left">
            <div>© {currentYear} SMyT. Todos los derechos reservados.</div>
            <div className="text-xs mt-0.5">Gobierno del Estado de Tlaxcala</div>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <ModulesSection />
        <FeaturesSection />
        <RolesSection />
        <TechStackSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
