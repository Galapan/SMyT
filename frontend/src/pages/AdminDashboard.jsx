import { useReducer, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Warehouse, Car, Key, Plus, RefreshCw, Bell, ChevronRight, CheckCircle, XCircle, X, AlertTriangle, Edit2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StatCard from '../components/dashboard/StatCard';
import AuditSearch from '../components/dashboard/AuditSearch';
import DepotTable from '../components/dashboard/DepotTable';
import VehicleRegistrationForm from '../components/dashboard/VehicleRegistrationForm';
import Toast from '../components/common/Toast';

const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

const initialState = {
  selectedNotif: null,
  resolving: false,
  loadingDetail: false,
  vehiculoDetail: null,
  isEditFormOpen: false,
  vehicleToEdit: null,
  editingNotifId: null,
  toast: { show: false, message: '', type: 'success' },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SELECTED_NOTIF':
      return { ...state, selectedNotif: action.payload };
    case 'SET_RESOLVING':
      return { ...state, resolving: action.payload };
    case 'SET_LOADING_DETAIL':
      return { ...state, loadingDetail: action.payload };
    case 'SET_VEHICULO_DETAIL':
      return { ...state, vehiculoDetail: action.payload };
    case 'SET_EDIT_FORM_OPEN':
      return { ...state, isEditFormOpen: action.payload };
    case 'OPEN_NOTIF':
      return { ...state, selectedNotif: action.payload, vehiculoDetail: null, loadingDetail: true };
    case 'CLOSE_NOTIF':
      return { ...state, selectedNotif: null, vehiculoDetail: null };
    case 'OPEN_EDIT':
      return { ...state, vehicleToEdit: action.payload.vehicleToEdit, editingNotifId: action.payload.editingNotifId, isEditFormOpen: true };
    case 'CLOSE_EDIT':
      return { ...state, isEditFormOpen: false, vehicleToEdit: null, editingNotifId: null };
    case 'SHOW_TOAST':
      return { ...state, toast: { show: true, message: action.payload.message, type: action.payload.type } };
    case 'HIDE_TOAST':
      return { ...state, toast: { ...state.toast, show: false } };
    default:
      return state;
  }
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Custom state for UI and Modals
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { selectedNotif, resolving, loadingDetail, vehiculoDetail, isEditFormOpen, vehicleToEdit, editingNotifId, toast } = state;

  // Query Client for invalidating queries later
  const queryClient = useQueryClient();

  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userRol = user?.rol || '';

  const showNotification = (message, type = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
  };

  const fetchDashboardData = async () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    
    const fetchPromises = [
      fetch(`${API_URL}/api/vehiculos/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`${API_URL}/api/depositos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ];

    if (userRol === 'SUPER_USUARIO' || userRol === 'ADMINISTRADOR') {
      fetchPromises.push(
        fetch(`${API_URL}/api/solicitudes?estatus=PENDIENTE`, {
           headers: { 'Authorization': `Bearer ${token}` }
        })
      );
    } else if (user?.id) {
      fetchPromises.push(
        fetch(`${API_URL}/api/solicitudes?estatus=RESUELTA&solicitanteId=${user.id}`, {
           headers: { 'Authorization': `Bearer ${token}` }
        })
      );
    }

    const responses = await Promise.all(fetchPromises);
    const [statsRes, depositosRes, notificacionesRes] = responses;

    const statsData = await statsRes.json();
    const depositosData = await depositosRes.json();
    let notificacionesData = { data: [] };

    if (notificacionesRes) {
       notificacionesData = await notificacionesRes.json();
    }

    return {
      stats: statsData.success ? statsData.data : {
        totalVehiculos: 0, ingresosHoy: 0, liberadosMes: 0, totalDepositos: 0
      },
      depositos: depositosData.success ? depositosData.data : [],
      notificaciones: notificacionesData.success ? notificacionesData.data : []
    };
  };

  const { data: dashboardData, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: fetchDashboardData,
    refetchInterval: 300000, // Auto-refresh cada 5 minutos
  });

  const loading = isLoading || isFetching;

  const stats = dashboardData?.stats || {
    totalVehiculos: 0, ingresosHoy: 0, liberadosMes: 0, totalDepositos: 0
  };
  const depositos = dashboardData?.depositos || [];
  const notificaciones = dashboardData?.notificaciones || [];

  const handleSearch = (searchParams) => {
    // Navigate to vehicles page with search params
    const queryParams = new URLSearchParams();
    if (searchParams.placa) queryParams.append('placa', searchParams.placa);
    if (searchParams.vin) queryParams.append('vin', searchParams.vin);
    if (searchParams.fechaInicio) queryParams.append('fechaInicio', searchParams.fechaInicio);
    if (searchParams.fechaFin) queryParams.append('fechaFin', searchParams.fechaFin);
    if (searchParams.estatusLegal) queryParams.append('estatusLegal', searchParams.estatusLegal);
    
    navigate(`/admin/vehicles?${queryParams.toString()}`);
  };

  const handleOpenNotif = async (notif) => {
    dispatch({ type: 'OPEN_NOTIF', payload: notif });
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/vehiculos/${notif.vehiculoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        dispatch({ type: 'SET_VEHICULO_DETAIL', payload: data.data });
      }
    } catch (error) {
      console.error('Error fetching vehicle detail:', error);
    } finally {
      dispatch({ type: 'SET_LOADING_DETAIL', payload: false });
    }
  };

  const handleResolveNotification = async (notifId, estatus) => {
    dispatch({ type: 'SET_RESOLVING', payload: true });
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/solicitudes/${notifId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estatus })
      });
      
      const result = await response.json();
      if (result.success) {
        // Refetch queries instead of manually filtering to keep data in sync
        queryClient.invalidateQueries({ queryKey: ['dashboard', user?.id] });
        dispatch({ type: 'CLOSE_NOTIF' });
        showNotification(result.message || 'Solicitud procesada correctamente');
      } else {
        showNotification(result.message || 'Error al procesar la solicitud', 'error');
      }
    } catch (error) {
      console.error('Error resolviendo solicitud:', error);
      showNotification('Error de conexión al procesar la solicitud', 'error');
    } finally {
      dispatch({ type: 'SET_RESOLVING', payload: false });
    }
  };

  const handleEditVehicle = async (notif) => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/vehiculos/${notif.vehiculoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        dispatch({ type: 'OPEN_EDIT', payload: { vehicleToEdit: data.data, editingNotifId: notif.id } });
      }
    } catch (error) {
      console.error('Error fetching vehicle to edit:', error);
    }
  };

  const handleEditSuccess = async () => {
    // Recargar datos y resolver solicitud
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user'));
    
    // Si estábamos editando desde una notificación, la marcamos como completada
    if (editingNotifId) {
      try {
        await fetch(`${API_URL}/api/solicitudes/${editingNotifId}/resolve`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ estatus: 'COMPLETADA' })
        });
      } catch (err) {
        console.error('Error al completar la solicitud:', err);
      }
    }

    // Al guardar la edición exitosamente, cerramos el modal
    dispatch({ type: 'CLOSE_EDIT' });
    
    // Invalidar para recargar datos
    queryClient.invalidateQueries({ queryKey: ['dashboard', user?.id] });
  };

  return (
    <div className="h-full flex flex-col space-y-4 overflow-y-auto lg:overflow-hidden pb-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500">Bienvenido de vuelta, gestiona los depósitos e inventario.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-medium"
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          {(userRol === 'SUPER_USUARIO' || userRol === 'ADMINISTRADOR') && (
            <button 
              onClick={() => navigate('/admin/deposits')}
              className="px-4 py-2 bg-(--color-primary) hover:bg-violet-900 text-white rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center font-medium"
            >
              <Plus size={20} className="mr-2" />
              Nuevo Depósito
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 shrink-0">
        <StatCard 
          title="Total de Vehículos" 
          value={stats.totalVehiculos.toString()} 
          icon={Warehouse}
          color="bg-(--color-primary)/15 text-(--color-primary)"
          trend="up"
          trendValue={`${stats.totalDepositos} depósitos`}
          loading={loading}
        />
        <StatCard 
          title="Vehículos Ingresados Hoy" 
          value={stats.ingresosHoy.toString()} 
          icon={Car}
          color="bg-(--color-verde)/15 text-(--color-verde)"
          trend="up"
          trendValue="Nuevos hoy"
          loading={loading}
        />
        <StatCard 
          title="Vehículos Liberados" 
          value={stats.liberadosMes.toString()} 
          icon={Key}
          color="bg-(--color-rosa)/15 text-(--color-rosa)"
          trend="down"
          trendValue="Este mes"
          loading={loading}
        />
      </div>

      {/* Global Search Section */}
      <div className="shrink-0">
        <AuditSearch onSearch={handleSearch} />
      </div>

      {/* Main Content Area (Grid for Dashboard config) */}
      <div className="flex-1 flex flex-col xl:flex-row gap-4 xl:gap-6 min-h-100 lg:min-h-0 lg:overflow-hidden">
        {/* Depot Management Section */}
        <div className={`flex flex-col min-h-100 xl:min-h-0 ${userRol === 'SUPER_USUARIO' ? 'xl:w-2/3' : 'w-full'} lg:overflow-hidden`}>
          <DepotTable loading={loading} depots={depositos} />
        </div>

        {/* Notificaciones Panel (SUPER_USUARIO ve pendientes, otros ven resueltas) */}
        {userRol === 'SUPER_USUARIO' ? (
          <div className="xl:w-1/3 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0 animate-fade-in h-100 xl:h-full">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center space-x-2">
                <Bell size={18} className="text-(--color-primary)" />
                <h3 className="font-semibold text-gray-800">Solicitudes de Edición</h3>
              </div>
              <span className="bg-(--color-primary)/15 text-(--color-primary) border border-(--color-primary)/20 text-xs font-bold px-2 py-1 rounded-full">
                {notificaciones.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {loading ? (
                <div className="space-y-2 animate-pulse">
                  {[1, 2, 3].map((item) => (
                    <div key={`skeleton-desktop-${item}`} className="p-4 rounded-lg border border-gray-100 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="h-3 w-16 bg-gray-200 rounded mb-1"></div>
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="h-3 w-12 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notificaciones.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                  <CheckCircle size={32} className="mb-2 text-(--color-primary) opacity-50" />
                  <p className="text-sm">No hay solicitudes pendientes</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notificaciones.map((notif) => (
                    <div 
                      key={notif.id}
                      role="button"
                      tabIndex={0} 
                      className="p-3 sm:p-4 rounded-lg border border-gray-100 bg-white hover:border-(--color-primary) hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => handleOpenNotif(notif)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleOpenNotif(notif);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-semibold text-gray-500 block">Vehículo</span>
                          <p className="text-sm font-bold text-(--color-primary)">{notif.vehiculo?.placa || 'Sin Placa'} - {notif.vehiculo?.folioProceso}</p>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {new Date(notif.fechaSolicitud).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <span className="text-xs font-semibold text-gray-500 block">Motivo</span>
                        <p className="text-sm text-gray-700 line-clamp-2">{notif.motivo}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                           <span className="truncate w-32">De: {notif.solicitante?.nombre}</span>
                        </div>
                        <div className="text-(--color-primary) opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-medium">Revisar</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="xl:w-1/3 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0 animate-fade-in h-100 xl:h-full">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center space-x-2">
                <CheckCircle size={18} className="text-(--color-verde)" />
                <h3 className="font-semibold text-gray-800">Mis Solicitudes Aprobadas</h3>
              </div>
              <span className="bg-(--color-verde)/15 text-(--color-verde) border border-(--color-verde)/20 text-xs font-bold px-2 py-1 rounded-full">
                {notificaciones.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {loading ? (
                <div className="space-y-4 animate-pulse px-2 pb-2">
                  {[1, 2, 3].map((item) => (
                    <div key={`skeleton-mobile-${item}`} className="p-4 rounded-xl border border-gray-200 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="h-3 w-16 bg-gray-200 rounded mb-1"></div>
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notificaciones.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                  <CheckCircle size={32} className="mb-2 text-(--color-verde) opacity-50" />
                  <p className="text-sm">No tienes solicitudes pendientes de edición</p>
                </div>
              ) : (
                <div className="space-y-4 px-2 pb-2">
                  {notificaciones.map((notif) => (
                    <div 
                      key={notif.id} 
                      className="p-4 rounded-xl border border-gray-200 bg-[#f9faf9] shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">Vehículo Aprobado</span>
                            <p className="text-sm font-bold text-[#1a1f36]">
                              {notif.vehiculo?.placa || 'Sin Placa'} - {notif.vehiculo?.folioProceso}
                            </p>
                          </div>
                          <span className="text-[10px] font-medium text-gray-400">
                            {new Date(notif.fechaResolucion || notif.fechaSolicitud).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mb-4">
                          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">Tu Solicitud</span>
                          <p className="text-sm text-gray-600 leading-relaxed">{notif.motivo}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEditVehicle(notif)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-(--color-primary) border border-(--color-primary) hover:bg-(--color-primary)/5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <Edit2 size={16} />
                        Editar Registro
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Modal Overlay */}
      {selectedNotif && createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            role="button"
            tabIndex={0}
            className="fixed inset-0 bg-gray-800/40 backdrop-blur-md transition-opacity"
            onClick={() => { if (!resolving) dispatch({ type: 'CLOSE_NOTIF' }); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (!resolving) dispatch({ type: 'CLOSE_NOTIF' });
              }
            }}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-up-fade">
            {/* Modal Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-(--color-naranja)/15 text-(--color-naranja) rounded-lg border border-(--color-naranja)/20">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Solicitud de Edición</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedNotif.fechaSolicitud).toLocaleDateString()} a las {new Date(selectedNotif.fechaSolicitud).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => dispatch({ type: 'CLOSE_NOTIF' })}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                disabled={resolving}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Vehicle Info - Skeleton or Loaded */}
              {loadingDetail ? (
                <div className="animate-pulse space-y-4">
                  <div className="bg-gray-100 rounded-xl p-4 border border-gray-100">
                    <div className="h-3 w-28 bg-gray-200 rounded mb-3"></div>
                    <div className="flex items-baseline space-x-2 mb-2">
                      <div className="h-5 w-32 bg-gray-200 rounded"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-3 w-40 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
                  </div>
                  <div>
                    <div className="h-3 w-36 bg-gray-200 rounded mb-3"></div>
                    <div className="bg-gray-100 rounded-xl p-4 border border-gray-100">
                      <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-gray-50">
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Vehicle Info */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 cursor-pointer hover:border-(--color-primary) hover:shadow-md transition-all group"
                       role="button"
                       tabIndex={0}
                       onClick={() => navigate(`/admin/auditoria/vehiculo/${selectedNotif.vehiculoId}`)}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter' || e.key === ' ') navigate(`/admin/auditoria/vehiculo/${selectedNotif.vehiculoId}`);
                       }}
                       title="Ver expediente completo del vehículo">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehículo Afectado</span>
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-(--color-primary) transition-colors" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-gray-900">{vehiculoDetail?.placa || selectedNotif.vehiculo?.placa || 'Sin Placa'}</span>
                      <span className="text-sm text-gray-500">({vehiculoDetail?.marcaTipo || selectedNotif.vehiculo?.marcaTipo})</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-mono">Folio: {vehiculoDetail?.folioProceso || selectedNotif.vehiculo?.folioProceso}</p>
                    {vehiculoDetail && (
                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
                        {vehiculoDetail.deposito?.nombre && (
                          <span className="text-xs text-gray-500">Depósito: <span className="font-semibold text-gray-700">{vehiculoDetail.deposito.nombre}</span></span>
                        )}
                        {vehiculoDetail.tipoServicio && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 font-medium">{vehiculoDetail.tipoServicio}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Justification */}
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Motivo de la solicitud</span>
                    <div className="bg-(--color-naranja)/5 border border-(--color-naranja)/20 rounded-xl p-4">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        "{selectedNotif.motivo}"
                      </p>
                    </div>
                  </div>
                  
                  {/* Applicant */}
                  <div className="flex items-center justify-between py-2 border-t border-gray-50">
                    <span className="text-xs font-semibold text-gray-500">Solicitado por:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedNotif.solicitante?.nombre} {selectedNotif.solicitante?.apellido}</span>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer / Actions */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 flex items-center justify-end space-x-3 border-t border-gray-100">
              <button
                onClick={() => handleResolveNotification(selectedNotif.id, 'RECHAZADA')}
                disabled={resolving}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center"
              >
                {resolving ? 'Procesando...' : 'Rechazar'}
              </button>
              <button
                onClick={() => handleResolveNotification(selectedNotif.id, 'RESUELTA')}
                disabled={resolving}
                className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) hover:bg-violet-900 rounded-lg shadow-sm flex items-center transition-all active:scale-95 disabled:opacity-50"
              >
                {resolving ? 'Procesando...' : 'Aprobar Solicitud'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Formulario de Edición Reutilizado */}
      {isEditFormOpen && vehicleToEdit && (
        <VehicleRegistrationForm 
          isOpen={isEditFormOpen} 
          onClose={() => dispatch({ type: 'SET_EDIT_FORM_OPEN', payload: false })}
          onSuccess={handleEditSuccess}
          initialData={vehicleToEdit}
        />
      )}

      {/* Depot Details Quick View Modal (Placeholder layout matching others) */}
      {selectedDepot && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
              <h3 className="text-xl font-bold text-gray-900">Detalles del Depósito</h3>
              <button 
                onClick={() => setSelectedDepot(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center font-bold text-2xl text-(--color-primary)">
                  {selectedDepot.nombre?.charAt(0) || 'D'}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedDepot.nombre}</h4>
                  <p className="text-sm text-gray-500 font-mono">ID: {selectedDepot.numero || selectedDepot.id.substring(0,8)}</p>
                </div>
                <div className="ml-auto">
                   <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedDepot.activo 
                        ? 'bg-(--color-verde)/15 text-(--color-verde)' 
                        : 'bg-(--color-rosa)/15 text-(--color-rosa)'
                    }`}>
                      {selectedDepot.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase">Ubicación</span>
                  <p className="mt-1 text-sm text-gray-900">{selectedDepot.municipio || 'No especificado'}</p>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase">Capacidad total</span>
                  <p className="mt-1 text-sm text-gray-900">{selectedDepot.capacidadTotal || 0} vehículos</p>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase">Teléfono</span>
                  <p className="mt-1 text-sm text-gray-900">{selectedDepot.telefono || 'No registrado'}</p>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase">Representante Legal</span>
                  <p className="mt-1 text-sm text-gray-900">{selectedDepot.representanteLegal || 'No asignado'}</p>
                </div>
              </div>

              {selectedDepot.direccion && (
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase">Dirección Completa</span>
                    <p className="mt-1 text-sm text-gray-900">{selectedDepot.direccion}</p>
                  </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedDepot(null)}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
               >
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => dispatch({ type: 'HIDE_TOAST' })}
      />
    </div>
  );

};

export default AdminDashboard;
