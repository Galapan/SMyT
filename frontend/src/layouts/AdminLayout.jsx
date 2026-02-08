import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Warehouse, 
  Search, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  UserCircle
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Leer usuario del storage al montar
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Si no hay usuario, redirigir a login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Depósitos', href: '/admin/depositos', icon: Warehouse },
    { name: 'Auditoría', href: '/admin/auditoria', icon: Search },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
  ];

  // Obtener nombre del rol para mostrar
  const getRolLabel = (rol) => {
    const roles = {
      'SUPER_USUARIO': 'Super Usuario',
      'ADMINISTRADOR_SMYT': 'Administrador',
      'USUARIO_CONCESIONARIO': 'Concesionario'
    };
    return roles[rol] || rol;
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo / Header */}
          <div className="h-24 flex items-center justify-center px-6 border-b border-gray-100 relative shrink-0">
            <img src="/src/assets/logo_smyt.png" alt="SMyT Logo" className="h-16 w-auto object-contain" />
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 absolute right-4"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
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
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <UserCircle size={40} className="text-gray-400" />
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {user ? `${user.nombre} ${user.apellido}` : 'Cargando...'}
                </p>
                <p className="text-xs text-gray-500">
                  {user ? getRolLabel(user.rol) : ''}
                </p>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-xs text-red-500 hover:text-red-700 mt-1 font-medium"
                >
                  <LogOut size={12} className="mr-1" />
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
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
