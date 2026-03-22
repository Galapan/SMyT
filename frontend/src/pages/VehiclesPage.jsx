import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Car, RefreshCw, Search, Eye, MoreVertical, ArrowUpDown, Filter as FilterIcon, LogOut, FileEdit, Trash2 } from 'lucide-react';
import VehicleRegistrationForm from '../components/dashboard/VehicleRegistrationForm';
import VehicleDetailsModal from '../components/dashboard/VehicleDetailsModal';
import RequestCorrectionModal from '../components/dashboard/RequestCorrectionModal';
import ActionMenu from '../components/common/ActionMenu';
import TableSkeleton from '../components/common/TableSkeleton';
import StatsSkeleton from '../components/common/StatsSkeleton';
import Pagination from '../components/common/Pagination';
import { motion } from 'framer-motion';
import useDebounce from '../hooks/useDebounce';

const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

const VehiclesHeader = ({ loading, onRefresh, onNew }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Gestión de Vehículos</h1>
      <p className="text-gray-500">Registra y administra vehículos en depósito.</p>
    </div>
    <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
      <button 
        onClick={onRefresh}
        className="flex-1 md:flex-none px-3 py-2 sm:px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-medium text-sm sm:text-base"
      >
        <RefreshCw size={18} className={`mr-1.5 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
        Actualizar
      </button>
      <button 
        onClick={onNew}
        className="flex-2 md:flex-none px-3 py-2 sm:px-4 bg-(--color-primary) hover:bg-violet-900 text-white rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center font-medium text-sm sm:text-base"
      >
        <Plus size={20} className="mr-1.5 sm:mr-2" />
        <span className="hidden sm:inline">Nuevo Registro Vehicular</span>
        <span className="sm:hidden">Nuevo Registro</span>
      </button>
    </div>
  </div>
);

const VehiclesStats = ({ loading, stats }) => (
  <>
    {loading ? (
      <StatsSkeleton cards={4} />
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-(--color-primary)/15 rounded-lg">
              <Car className="w-6 h-6 text-(--color-primary)" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVehiculos}</p>
              <p className="text-sm text-gray-500">Vehículos Activos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-verde/15 rounded-lg">
              <Car className="w-6 h-6 text-verde" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.ingresosHoy}</p>
              <p className="text-sm text-gray-500">Ingresos Hoy</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-naranja/15 rounded-lg">
              <Car className="w-6 h-6 text-naranja" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDepositos}</p>
              <p className="text-sm text-gray-500">Depósitos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rojo/15 rounded-lg">
              <Car className="w-6 h-6 text-rojo" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.liberadosMes}</p>
              <p className="text-sm text-gray-500">Bajas Este Mes</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);

const VehiclesTable = ({
  loading,
  filteredVehiculos,
  paginatedVehiculos,
  searchTerm,
  onSearchChange,
  estatusLegalFilter,
  onEstatusChange,
  getStatusColor,
  onShowDetails,
  onRegisterDeparture,
  onRequestEdit,
  onDeleteVehicle,
  currentUser,
  pagination,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-4 sm:p-6 border-b border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900">Vehículos Registrados</h2>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por placa, VIN, marca..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none w-full md:w-64"
          />
        </div>
        {/* Estatus Filter Dropdown */}
        <div className="relative w-full md:w-auto mt-3 md:mt-0">
          <select
            value={estatusLegalFilter}
            onChange={onEstatusChange}
            className="pl-10 pr-8 py-2 w-full md:w-48 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none appearance-none text-sm text-gray-700"
          >
            <option value="">Todos los Estatus</option>
            <option value="ROBADO">Robado</option>
            <option value="DECOMISADO">Decomisado</option>
            <option value="SINIESTRADO">Siniestrado</option>
            <option value="OBSOLETO">Obsoleto</option>
          </select>
          <FilterIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>

    {loading ? (
      <TableSkeleton rows={5} columns={7} />
    ) : filteredVehiculos.length === 0 ? (
      <div className="p-12 text-center">
        <Car className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">
          {searchTerm ? 'No se encontraron vehículos con esos criterios.' : 'No hay vehículos registrados.'}
        </p>
        <p className="text-sm text-gray-400">Haz clic en "Nuevo Registro Vehicular" para comenzar.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        {/* Table view for md+ screens */}
        <table className="hidden md:table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                  Folio <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca/Tipo</th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VIN</th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Ingreso</th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <motion.tbody 
            key={pagination.currentPage}
            className="divide-y divide-gray-100"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
          >
            {paginatedVehiculos.map((vehiculo) => (
              <motion.tr 
                key={vehiculo.id} 
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-(--color-primary)">{vehiculo.folioProceso}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">{vehiculo.placa}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">{vehiculo.marcaTipo}</span>
                  <span className="text-xs text-gray-400 ml-2">({vehiculo.anio})</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className="text-xs font-mono text-gray-500">{vehiculo.vin}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehiculo.estatusLegal)}`}>
                    {vehiculo.estatusLegal}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {new Date(vehiculo.fechaIngreso).toLocaleDateString('es-MX')}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end">
                    <ActionMenu 
                      options={[
                        { label: 'Ver Detalles', icon: Eye, onClick: () => onShowDetails(vehiculo) },
                        { label: 'Registrar Salida / Entrega', icon: LogOut, onClick: () => onRegisterDeparture && onRegisterDeparture(vehiculo), hidden: currentUser?.rol !== 'ADMINISTRADOR_CONCESIONARIO' },
                        { label: 'Eliminar Registro', icon: Trash2, onClick: () => onDeleteVehicle && onDeleteVehicle(vehiculo), danger: true, hidden: currentUser?.rol !== 'SUPER_USUARIO' }
                      ]}
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
        
        {/* Card view for smaller screens */}
        <motion.div 
          key={pagination.currentPage}
          className="md:hidden flex flex-col divide-y divide-gray-100"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
        >
          {paginatedVehiculos.map((vehiculo) => (
            <motion.div 
              key={vehiculo.id} 
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              {/* Top row: Folio, Placa, Status */}
              <div className="flex justify-between items-start mb-3">
                <div className="pr-2">
                  <span className="text-xs font-medium text-(--color-primary) mb-0.5 block">Folio: {vehiculo.folioProceso}</span>
                  <div className="text-sm font-bold text-gray-900 leading-tight flex items-center gap-2">
                    {vehiculo.placa}
                  </div>
                </div>
                <span className={`shrink-0 inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${getStatusColor(vehiculo.estatusLegal)}`}>
                  {vehiculo.estatusLegal}
                </span>
              </div>
              
              {/* Middle row: Info details */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <p className="font-semibold text-gray-500 mb-0.5">Vehículo</p>
                  <p className="text-gray-900 truncate" title={`${vehiculo.marcaTipo} (${vehiculo.anio})`}>
                    {vehiculo.marcaTipo} <span className="text-gray-400">({vehiculo.anio})</span>
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500 mb-0.5">Fecha Ingreso</p>
                  <p className="text-gray-900">{new Date(vehiculo.fechaIngreso).toLocaleDateString('es-MX')}</p>
                </div>
              </div>
              
              {/* Bottom row: VIN and Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="text-xs font-mono text-gray-400">
                  VIN: {vehiculo.vin}
                </div>
                <ActionMenu 
                  options={[
                    { label: 'Ver Detalles', icon: Eye, onClick: () => onShowDetails(vehiculo) },
                    { label: 'Registrar Salida / Entrega', icon: LogOut, onClick: () => onRegisterDeparture && onRegisterDeparture(vehiculo), hidden: currentUser?.rol !== 'ADMINISTRADOR_CONCESIONARIO' },
                    { label: 'Eliminar Registro', icon: Trash2, onClick: () => onDeleteVehicle && onDeleteVehicle(vehiculo), danger: true, hidden: currentUser?.rol !== 'SUPER_USUARIO' }
                  ]}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    )}

    {/* Table Footer */}
    {filteredVehiculos.length > 0 && (
      <Pagination 
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.itemsPerPage}
        currentPage={pagination.currentPage}
        onPageChange={pagination.onPageChange}
      />
    )}
  </div>
);

const initialState = {
  isFormOpen: false,
  vehiculos: [],
  stats: {
    totalVehiculos: 0,
    ingresosHoy: 0,
    liberadosMes: 0,
    totalDepositos: 0
  },
  loading: true,
  searchTerm: '',
  estatusLegalFilter: '',
  fechaInicioFilter: '',
  fechaFinFilter: '',
  isDetailsOpen: false,
  selectedVehicle: null,
  isCorrectionModalOpen: false,
  vehicleForCorrection: null,
  currentPage: 1,
  itemsPerPage: 7,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FORM_OPEN':
      return { ...state, isFormOpen: action.payload };
    case 'SET_VEHICULOS':
      return { ...state, vehiculos: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case 'SET_ESTATUS_LEGAL_FILTER':
      return { ...state, estatusLegalFilter: action.payload, currentPage: 1 };
    case 'SET_FECHA_FILTER':
      return { ...state, fechaInicioFilter: action.payload.inicio, fechaFinFilter: action.payload.fin, currentPage: 1 };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SHOW_DETAILS':
      return { ...state, isDetailsOpen: true, selectedVehicle: action.payload };
    case 'HIDE_DETAILS':
      return { ...state, isDetailsOpen: false, selectedVehicle: null };
    case 'OPEN_CORRECTION_MODAL':
      return { ...state, isCorrectionModalOpen: true, vehicleForCorrection: action.payload };
    case 'CLOSE_CORRECTION_MODAL':
      return { ...state, isCorrectionModalOpen: false, vehicleForCorrection: null };
    default:
      return state;
  }
}

const VehiclesPage = () => {
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isFormOpen, vehiculos, stats, loading, searchTerm, estatusLegalFilter, fechaInicioFilter, fechaFinFilter, isDetailsOpen, selectedVehicle, isCorrectionModalOpen, vehicleForCorrection } = state;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
      return stored ? JSON.parse(stored) : { rol: 'ADMINISTRADOR_CONCESIONARIO' }; // Fallback for safety
    } catch {
      return { rol: 'ADMINISTRADOR_CONCESIONARIO' };
    }
  };
  const currentUser = getStoredUser();

  const fetchData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      
      const [vehiculosRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/vehiculos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/vehiculos/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [vehiculosData, statsData] = await Promise.all([
        vehiculosRes.json(),
        statsRes.json()
      ]);

      if (vehiculosData.success) {
        dispatch({ type: 'SET_VEHICULOS', payload: vehiculosData.data });
      }
      if (statsData.success) {
        dispatch({ type: 'SET_STATS', payload: statsData.data });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    const estatusLegal = searchParams.get('estatusLegal');
    const searchTermFromUrl = searchParams.get('placa') || searchParams.get('vin') || '';
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');
    
    if (estatusLegal) {
      dispatch({ type: 'SET_ESTATUS_LEGAL_FILTER', payload: estatusLegal });
    }
    
    if (fechaInicio || fechaFin) {
      dispatch({ type: 'SET_FECHA_FILTER', payload: { inicio: fechaInicio || '', fin: fechaFin || '' } });
    }

    if (searchTermFromUrl) {
      dispatch({ type: 'SET_SEARCH_TERM', payload: searchTermFromUrl });
    }
  }, [fetchData, searchParams]);

  const handleFormSuccess = () => {
    fetchData();
  };

  const filteredVehiculos = useMemo(() => {
    return vehiculos.filter(v => {
      const matchesSearch = v.placa.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                            v.vin.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                            v.marcaTipo.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                            v.folioProceso.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesEstatus = estatusLegalFilter ? v.estatusLegal === estatusLegalFilter : true;
      
      let matchesFecha = true;
      if (fechaInicioFilter) {
        const vDate = new Date(v.fechaIngreso);
        const start = new Date(fechaInicioFilter + 'T00:00:00');
        // add 24 hours to include the whole day if no end date
        const end = fechaFinFilter ? new Date(fechaFinFilter + 'T23:59:59') : new Date(fechaInicioFilter + 'T23:59:59');
        matchesFecha = vDate >= start && vDate <= end;
      }
      
      return matchesSearch && matchesEstatus && matchesFecha;
    });
  }, [vehiculos, debouncedSearchTerm, estatusLegalFilter, fechaInicioFilter, fechaFinFilter]);

  const paginatedVehiculos = useMemo(() => {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    return filteredVehiculos.slice(start, start + state.itemsPerPage);
  }, [filteredVehiculos, state.currentPage, state.itemsPerPage]);

  const getStatusColor = (status) => {
    const colors = {
      'ROBADO': 'bg-(--color-rojo)/15 text-(--color-rojo) border border-(--color-rojo)/20 font-bold',
      'DECOMISADO': 'bg-(--color-naranja)/15 text-(--color-naranja) border border-(--color-naranja)/20 font-bold',
      'OBSOLETO': 'bg-gray-100 text-gray-700',
      'SINIESTRADO': 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const isConcesionarioSinDeposito = currentUser?.rol === 'ADMINISTRADOR_CONCESIONARIO' && !currentUser?.depositoId;

  if (isConcesionarioSinDeposito) {
    return (
      <div className="space-y-4 md:space-y-8">
        <VehiclesHeader
          loading={false}
          onRefresh={() => {}}
          onNew={() => {}}
        />
        <div className="flex items-center justify-center py-20">
          <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Sin concesionario asignado</h3>
            <p className="text-gray-500 max-w-sm">No estás asignado a ningún concesionario. Contacta al administrador para vincular tu cuenta a un depósito.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8">
      <VehiclesHeader
        loading={loading}
        onRefresh={fetchData}
        onNew={() => dispatch({ type: 'SET_FORM_OPEN', payload: true })}
      />

      <VehiclesStats loading={loading} stats={stats} />

      <VehiclesTable
        loading={loading}
        filteredVehiculos={filteredVehiculos}
        paginatedVehiculos={paginatedVehiculos}
        searchTerm={searchTerm}
        onSearchChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
        estatusLegalFilter={estatusLegalFilter}
        onEstatusChange={(e) => dispatch({ type: 'SET_ESTATUS_LEGAL_FILTER', payload: e.target.value })}
        getStatusColor={getStatusColor}
        onShowDetails={(vehiculo) => dispatch({ type: 'SHOW_DETAILS', payload: vehiculo })}
        onRegisterDeparture={(v) => console.log('Registrar salida', v)}
        onRequestEdit={(v) => dispatch({ type: 'OPEN_CORRECTION_MODAL', payload: v })}
        onDeleteVehicle={(v) => console.log('Eliminar vehiculo', v)}
        currentUser={currentUser}
        pagination={{
          totalItems: filteredVehiculos.length,
          itemsPerPage: state.itemsPerPage,
          currentPage: state.currentPage,
          onPageChange: (page) => dispatch({ type: 'SET_PAGE', payload: page }),
        }}
      />

      {/* Vehicle Registration Form Modal */}
      <VehicleRegistrationForm 
        isOpen={isFormOpen} 
        onClose={() => dispatch({ type: 'SET_FORM_OPEN', payload: false })}
        onSuccess={handleFormSuccess}
      />

      {/* Vehicle Details Modal */}
      <VehicleDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => dispatch({ type: 'HIDE_DETAILS' })}
        vehiculo={selectedVehicle}
      />

      {/* Request Correction Modal */}
      <RequestCorrectionModal 
        isOpen={isCorrectionModalOpen}
        onClose={() => dispatch({ type: 'CLOSE_CORRECTION_MODAL' })}
        vehiculo={vehicleForCorrection}
        onSuccess={(msg) => {
          dispatch({ type: 'CLOSE_CORRECTION_MODAL' });
          alert(msg); // Opcionalmente usar el Toast
        }}
      />
    </div>
  );
};

export default VehiclesPage;
