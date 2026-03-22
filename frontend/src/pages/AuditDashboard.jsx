import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Search, Warehouse, Users, Car, MapPin, Eye, Phone, ShieldCheck, Mail } from 'lucide-react';
import AuditConcesionarioCard from '../components/dashboard/Audit/AuditConcesionarioCard';
import Pagination from '../components/common/Pagination';

const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

const ConcesionarioLoadingSkeleton = () => (
  <div className="h-full flex flex-col space-y-6">
    <div className="h-16 w-full bg-white rounded-xl border border-gray-100 flex items-center px-6 animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded-md mr-4"></div>
      <div className="w-48 h-6 bg-gray-200 rounded-md"></div>
    </div>
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 h-96 bg-white rounded-xl border border-gray-100 animate-pulse"></div>
      <div className="lg:col-span-2 h-full bg-white rounded-xl border border-gray-100 animate-pulse"></div>
    </div>
  </div>
);

const NoDepositoAssigned = () => (
  <div className="h-full flex items-center justify-center">
    <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <Warehouse size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Sin concesionario asignado</h3>
      <p className="text-gray-500 max-w-sm">No se encontró un depósito vinculado a tu cuenta. Contacta al administrador.</p>
    </div>
  </div>
);

const ConcesionarioHeader = ({ loading, onRefresh }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mi Concesionario</h1>
      <p className="text-gray-500 text-sm mt-1">Resumen de tu concesionario y cuentas vinculadas.</p>
    </div>
    <div className="flex gap-3">
      <button 
        onClick={onRefresh}
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-medium shadow-sm active:scale-95"
      >
        <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
        Actualizar
      </button>
    </div>
  </div>
);

const getOcupacionColor = (pct) => {
  if (pct >= 90) return 'text-(--color-rojo) bg-(--color-rojo)/10 border-(--color-rojo)/20';
  if (pct >= 75) return 'text-(--color-naranja) bg-(--color-naranja)/10 border-(--color-naranja)/20';
  return 'text-(--color-verde) bg-(--color-verde)/10 border-(--color-verde)/20';
};

const DealershipInfoCard = ({ deposito, ocupacion }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
      <div className="flex items-center gap-2">
        <Warehouse size={18} className="text-(--color-primary)" />
        <h3 className="font-semibold text-gray-800">{deposito.nombre}</h3>
      </div>
      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getOcupacionColor(ocupacion)}`}>
        {ocupacion}% Ocupado
      </span>
    </div>
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin size={14} className="text-gray-400 shrink-0" />
        <span>{deposito.direccion}, {deposito.municipio}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Phone size={14} className="text-gray-400 shrink-0" />
        <span>{deposito.telefono}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Car size={12} /> Vehículos
          </span>
          <span className="text-lg font-bold text-gray-800">
            {deposito._count.vehiculos} <span className="text-sm font-medium text-gray-400">/ {deposito.capacidad}</span>
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Users size={12} /> Cuentas
          </span>
          <span className="text-lg font-bold text-gray-800">
            {deposito.usuarios?.length || 0}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const RepresentanteLegalCard = ({ deposito }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
      <ShieldCheck size={18} className="text-gray-600" />
      <h3 className="font-semibold text-gray-800">Representante Legal</h3>
    </div>
    <div className="p-5 space-y-3">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Nombre</p>
        <p className="font-medium text-gray-900">{deposito.nombrePropietario}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">RFC</p>
          <p className="text-sm font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded inline-block border border-gray-100">{deposito.rfc}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Teléfono</p>
          <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
            <Phone size={14} className="text-gray-400" />
            {deposito.telefonoPropietario}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const CuentasVinculadasCard = ({ deposito }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
      <div className="flex items-center gap-2">
        <Users size={18} className="text-(--color-primary)" />
        <h3 className="font-semibold text-gray-800">Cuentas Vinculadas</h3>
      </div>
      <span className="bg-white border border-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
        {deposito.usuarios?.length || 0}
      </span>
    </div>
    <div className="p-3 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
      {!deposito.usuarios || deposito.usuarios.length === 0 ? (
        <p className="text-sm text-center text-gray-500 py-4">Sin cuentas vinculadas</p>
      ) : (
        deposito.usuarios.map(u => (
          <div key={u.id} className="flex items-center p-3 rounded-lg border border-gray-100 bg-gray-50/50">
            <div className="h-10 w-10 shrink-0 rounded-full border border-gray-200 bg-white overflow-hidden">
              <img
                src={(u.fotoUrl && !u.fotoUrl.includes('name=User'))
                  ? u.fotoUrl
                  : `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(u.nombre + ' ' + u.apellido)}`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">{u.nombre} {u.apellido}</p>
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <Mail size={12} /> {u.email}
              </p>
            </div>
            <div className="shrink-0 ml-2">
              <div className={`w-2 h-2 rounded-full ${u.activo ? 'bg-verde' : 'bg-rosa'}`} title={u.activo ? 'Activa' : 'Inactiva'} />
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const ConcesionarioQuickStats = ({ deposito }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-violet-100 rounded-lg">
          <Car className="w-6 h-6 text-(--color-primary)" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{deposito._count.vehiculos}</p>
          <p className="text-sm text-gray-500">Vehículos Activos</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-verde/15 rounded-lg">
          <Warehouse className="w-6 h-6 text-verde" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{deposito.capacidad}</p>
          <p className="text-sm text-gray-500">Capacidad Total</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-naranja/15 rounded-lg">
          <Users className="w-6 h-6 text-naranja" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{deposito.usuarios?.length || 0}</p>
          <p className="text-sm text-gray-500">Usuarios Vinculados</p>
        </div>
      </div>
    </div>
  </div>
);

const InspectInventoryCard = ({ onInspect }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
    <div className="bg-(--color-primary)/5 p-4 rounded-full mb-4">
      <Search size={32} className="text-(--color-primary)" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">Inspeccionar Inventario</h3>
    <p className="text-gray-500 text-sm max-w-md mb-4">
      Revisa el detalle completo de tu concesionario: vehículos registrados, información legal y más.
    </p>
    <button 
      onClick={onInspect}
      className="px-6 py-3 bg-(--color-primary) text-white font-medium text-sm rounded-lg hover:bg-violet-900 transition-colors shadow-md flex items-center gap-2 active:scale-95"
    >
      <Eye size={18} />
      Ver Inventario Completo
    </button>
  </div>
);

const ConcesionarioView = ({ depositos, loading, onRefresh, onInspectDeposito }) => {
  const deposito = depositos[0]; // Only their dealership comes from the API

  if (loading) return <ConcesionarioLoadingSkeleton />;
  if (!deposito) return <NoDepositoAssigned />;

  const ocupacion = deposito.capacidad > 0 
    ? Math.round((deposito._count.vehiculos / deposito.capacidad) * 100) 
    : 0;

  return (
    <div className="h-full flex flex-col space-y-6">
      <ConcesionarioHeader loading={loading} onRefresh={onRefresh} />

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 pb-6">

        {/* Left Column: Dealership Info */}
        <div className="lg:col-span-1 space-y-6">
          <DealershipInfoCard deposito={deposito} ocupacion={ocupacion} />
          <RepresentanteLegalCard deposito={deposito} />
          <CuentasVinculadasCard deposito={deposito} />
        </div>

        {/* Right Column: Quick Access */}
        <div className="lg:col-span-2 space-y-6">
          <ConcesionarioQuickStats deposito={deposito} />
          <InspectInventoryCard onInspect={() => onInspectDeposito(deposito.id)} />
        </div>
      </div>
    </div>
  );
};

const AdminHeader = ({ loading, searchTerm, onSearch, onRefresh }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Auditoría Global</h1>
      <p className="text-gray-500 text-sm mt-1">Supervisión en tiempo real de concesionarios y cuentas vinculadas.</p>
    </div>
    <div className="flex gap-3">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text"
          placeholder="Buscar concesionario..."
          value={searchTerm}
          onChange={onSearch}
          className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-all"
        />
      </div>
      <button 
        onClick={onRefresh}
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-medium shadow-sm active:scale-95"
      >
        <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
        Actualizar
      </button>
    </div>
  </div>
);

const AdminLoadingGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <div key={`skeleton-${item}`} className="w-full h-64 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between animate-pulse">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="w-20 h-6 bg-gray-200 rounded-md"></div>
          </div>
          <div className="w-3/4 h-6 bg-gray-200 rounded-md mb-2"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded-md"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
          <div>
            <div className="w-16 h-3 bg-gray-200 rounded mb-2"></div>
            <div className="w-24 h-5 bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="w-16 h-3 bg-gray-200 rounded mb-2"></div>
            <div className="w-24 h-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const AdminEmptyState = ({ searchTerm }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
    <div className="bg-gray-50 p-4 rounded-full mb-4">
      <Warehouse size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">No hay concesionarios</h3>
    <p className="text-gray-500 max-w-sm">No se encontraron depósitos que coincidan con tu búsqueda actual.</p>
  </div>
);

const AdminGrid = ({ paginatedDepositos }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {paginatedDepositos.map(deposito => (
      <AuditConcesionarioCard key={deposito.id} deposito={deposito} />
    ))}
  </div>
);

const AdminPagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => (
  <>
    {totalItems > 0 && (
      <div className="mt-6 border border-gray-100 rounded-lg overflow-hidden">
        <Pagination 
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    )}
  </>
);

const AdminView = ({
  loading,
  searchTerm,
  onSearch,
  onRefresh,
  filteredDepositos,
  paginatedDepositos,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => (
  <div className="h-full flex flex-col space-y-6">
    <AdminHeader loading={loading} searchTerm={searchTerm} onSearch={onSearch} onRefresh={onRefresh} />

    {/* Main Content */}
    <div className="flex-1 pb-8">
      {loading ? (
        <AdminLoadingGrid />
      ) : filteredDepositos.length === 0 ? (
        <AdminEmptyState searchTerm={searchTerm} />
      ) : (
        <>
          <AdminGrid paginatedDepositos={paginatedDepositos} />
          <AdminPagination
            totalItems={filteredDepositos.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  </div>
);

const AuditDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isConcesionario = user?.rol === 'ADMINISTRADOR_CONCESIONARIO';

  const fetchAuditData = useCallback(async () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/depositos/audit`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Error fetching audit data');
    }
    return data.data;
  }, []);

  const { data: depositos = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['depositosAudit'],
    queryFn: fetchAuditData,
  });

  const loading = isLoading || isFetching;

  const filteredDepositos = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return depositos;
    return depositos.filter(dep => 
      dep.nombre.toLowerCase().includes(term) || 
      dep.municipio.toLowerCase().includes(term) ||
      dep.nombrePropietario.toLowerCase().includes(term)
    );
  }, [depositos, searchTerm]);

  const paginatedDepositos = useMemo(() => {
    return filteredDepositos.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredDepositos, currentPage, itemsPerPage]);

  // --- CONCESIONARIO VIEW: Single dealership ---
  if (isConcesionario) {
    return (
      <ConcesionarioView
        depositos={depositos}
        loading={loading}
        onRefresh={() => refetch()}
        onInspectDeposito={(depositoId) => navigate(`/dashboard/auditoria/${depositoId}`)}
      />
    );
  }

  // --- ADMIN / SUPER_USUARIO VIEW: Global audit grid (original) ---
  return (
    <AdminView
      loading={loading}
      searchTerm={searchTerm}
      onSearch={handleSearch}
      onRefresh={() => refetch()}
      filteredDepositos={filteredDepositos}
      paginatedDepositos={paginatedDepositos}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
};

export default AuditDashboard;
