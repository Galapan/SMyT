import { useState, useEffect } from 'react';
import { useOutlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Warehouse,
  Car,
  Search,
  Settings,
  Menu,
  X,
  LogOut,
  UserCircle,
  Users
} from 'lucide-react';
import logoSmyt from '../assets/logo_smyt.png';
import { formatRole } from '../utils/formatRole';
import { useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll al inicio al cambiar de ruta
  useEffect(() => {
    const mainContent = document.getElementById('main-scroll-container');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);
  const queryClient = useQueryClient();
  const outlet = useOutlet();

  // Helper para imagen
  const getAvatarUrl = (u) => {
    if (!u) return '';
    if (u.fotoUrl) return u.fotoUrl;
    return `https://ui-avatars.com/api/?background=random&color=fff&name=${u.nombre}+${u.apellido}`;
  };

  // Leer usuario del storage al montar y escuchar cambios
  useEffect(() => {
    const loadUser = () => {
      const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigate('/login');
      }
    };

    loadUser();

    // Escuchar evento de storage para actualizar avatar si cambia en otra pestaña o componente
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, [navigate]);

  // Verificación periódica de sesión (Heartbeat) automática
  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) return;

    // Verificar cada 15 segundos si la sesión sigue activa en el servidor
    const checkSession = async () => {
      try {
        await fetch(`${API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Si el servidor responde 401 SESSION_REPLACED, el interceptor global 
        // en main.jsx tomará el control automáticamente y expulsará al usuario.
      } catch (error) {
        // Errores de red silenciosos
      }
    };

    const interval = setInterval(checkSession, 10000); 
    
    // Llamar la primera vez con un pequeño retraso para no bloquear la carga inicial
    const timeout = setTimeout(checkSession, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleLogout = async () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    
    // Llamar al backend para limpiar el token de sesión
    if (token) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      } catch (error) {
        console.error('Error al cerrar sesión en el backend:', error);
      }
    }
    
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Invalidar caché de React Query para evitar datos fantasma
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Depósitos', href: '/dashboard/deposits', icon: Warehouse, roles: ['SUPER_USUARIO', 'ADMINISTRADOR'] },
    { name: 'Vehículos', href: '/dashboard/vehicles', icon: Car, roles: ['ADMINISTRADOR', 'ADMINISTRADOR_CONCESIONARIO'] },
    { name: 'Auditoría', href: '/dashboard/auditoria', icon: Search },
    { name: 'Cuentas', href: '/dashboard/accounts', icon: Users, roles: ['SUPER_USUARIO'] },
    { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          role="button"
          tabIndex={0}
          className="fixed inset-0 bg-gray-800/40 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setIsSidebarOpen(false);
          }}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-[80%] max-w-64 sm:max-w-none sm:w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo / Header */}
          <div className="h-24 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
            <div className="flex-1 flex justify-center lg:justify-start">
              <img src={logoSmyt} alt="SMyT Logo" className="h-16 w-auto object-contain" />
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              if (item.roles && user && !item.roles.includes(user.rol)) return null;

              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-(--color-primary) text-white' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-(--color-primary)'}
                  `}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-gray-100 shrink-0">
            <div
                 role="button"
                 tabIndex={0}
                 className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                 onClick={() => {
                   navigate('/dashboard/settings');
                   setIsSidebarOpen(false);
                 }}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' || e.key === ' ') {
                     navigate('/dashboard/settings');
                     setIsSidebarOpen(false);
                   }
                 }}>
              <div className="h-10 w-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                {user ? (
                   <img
                   src={getAvatarUrl(user)}
                   alt="Profile"
                   className="h-full w-full object-cover"
                 />
                ) : (
                  <UserCircle size={40} className="text-gray-400" />
                )}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {user ? `${user.nombre} ${user.apellido}` : 'Cargando...'}
                </p>
                <p className="text-xs text-gray-500">
                  {user ? formatRole(user.rol) : ''}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Evita navegar a settings cuando se hace click en cerrar sesión
                    handleLogout();
                  }}
                  className="flex items-center text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md mt-2 font-semibold transition-colors w-full justify-center md:w-auto md:justify-start border border-red-100"
                >
                  <LogOut size={14} className="mr-1.5" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:hidden shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-700">SMyT Dashboard</span>
          <div className="w-10" /> {/* Spacer for balance */}
        </header>

        {/* Page Content */}
        <main id="main-scroll-container" className="flex-1 p-4 lg:p-8 overflow-x-hidden overflow-y-auto bg-gray-50/50">
          <div className="max-w-7xl mx-auto lg:h-full">
            <AnimatePresence mode="wait">
              {outlet && (
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -15, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.3, type: 'spring', bounce: 0, damping: 20 }}
                  className="h-full w-full"
                >
                  {outlet}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
