import { useReducer, useEffect, useCallback } from "react";
import {
  Plus,
  Warehouse,
  RefreshCw,
  Search,
  Eye,
  MoreVertical,
  ArrowUpDown,
  Trash2,
  Ban,
  Check,
  AlertTriangle
} from "lucide-react";
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import DepositRegistrationForm from "../components/dashboard/DepositRegistrationForm";
import TableSkeleton from "../components/common/TableSkeleton";
import StatsSkeleton from "../components/common/StatsSkeleton";
import Pagination from "../components/common/Pagination";
import ActionMenu from "../components/common/ActionMenu";
import Toast from "../components/common/Toast";

const API_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : import.meta.env.DEV
      ? "http://localhost:3000"
      : "";

const initialState = {
  isFormOpen: false,
  depositos: [],
  stats: {
    totalDepositos: 0,
    depositosActivos: 0,
    capacidadTotal: 0,
    vehiculosEnDepositos: 0,
  },
  loading: true,
  searchTerm: "",
  currentPage: 1,
  itemsPerPage: 7,
  toast: { show: false, message: '', type: 'success' },
  confirmModal: { isOpen: false, depositoId: null, currentStatus: null }
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_DATA":
      return {
        ...state,
        depositos:
          action.payload.depositos !== undefined
            ? action.payload.depositos
            : state.depositos,
        stats:
          action.payload.stats !== undefined
            ? action.payload.stats
            : state.stats,
      };
    case "SET_FORM_OPEN":
      return { ...state, isFormOpen: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SHOW_TOAST":
      return { ...state, toast: { show: true, message: action.payload.message, type: action.payload.type } };
    case "HIDE_TOAST":
      return { ...state, toast: { ...state.toast, show: false } };
    case "OPEN_CONFIRM":
      return { ...state, confirmModal: { isOpen: true, depositoId: action.payload.depositoId, currentStatus: action.payload.currentStatus } };
    case "CLOSE_CONFIRM":
      return { ...state, confirmModal: { ...state.confirmModal, isOpen: false } };
    default:
      return state;
  }
}

const ConfirmStatusModal = ({ isOpen, currentStatus, onClose, onConfirm }) => (
  <>
    {createPortal(
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <LazyMotion features={domAnimation}>
              <m.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 bg-gray-800/40 backdrop-blur-md"
                onClick={onClose}
              />
              <m.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden mx-4"
              >
                <div className="p-4 sm:p-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${currentStatus ? 'bg-(--color-rojo)/15 text-(--color-rojo)' : 'bg-(--color-verde)/15 text-(--color-verde)'}`}>
                    {currentStatus ? <AlertTriangle size={24} /> : <Check size={24} />}
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                    ¿{currentStatus ? 'Desactivar' : 'Activar'} Depósito?
                  </h3>
                  <p className="text-center text-gray-500 text-sm mb-6">
                    {currentStatus 
                      ? 'No se podrán registrar más vehículos en este depósito hasta reactivarlo.' 
                      : 'El depósito cambiará su estado a activo y se podrá usar para nuevos registros.'}
                  </p>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={onConfirm}
                      className={`flex-1 px-4 py-2.5 text-white font-medium rounded-xl transition-colors opacity-90 hover:opacity-100 ${currentStatus ? 'bg-(--color-rojo)' : 'bg-(--color-verde)'}`}
                    >
                      {currentStatus ? 'Sí, Desactivar' : 'Sí, Activar'}
                    </button>
                  </div>
                </div>
              </m.div>
            </LazyMotion>
          </div>
        )}
      </AnimatePresence>,
      document.getElementById('modal-root') || document.body
    )}
  </>
);

const DepositsHeader = ({ loading, onRefresh, onNew }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Gestión de Depósitos
      </h1>
      <p className="text-gray-500">
        Registra y administra depósitos vehiculares.
      </p>
    </div>
    <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
      <button
        onClick={onRefresh}
        className="flex-1 md:flex-none px-3 py-2 sm:px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-medium text-sm sm:text-base"
      >
        <RefreshCw
          size={18}
          className={`mr-1.5 sm:mr-2 ${loading ? "animate-spin" : ""}`}
        />
        Actualizar
      </button>
      <button
        onClick={onNew}
        className="flex-1 md:flex-none px-3 py-2 sm:px-4 bg-(--color-primary) hover:bg-violet-900 text-white rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center font-medium text-sm sm:text-base"
      >
        <Plus size={20} className="mr-1.5 sm:mr-2" />
        Registrar
      </button>
    </div>
  </div>
);

const DepositsStats = ({ loading, stats }) => (
  <>
    {loading ? (
      <StatsSkeleton cards={4} />
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-100 rounded-lg">
              <Warehouse className="w-6 h-6 text-(--color-primary)" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalDepositos}
              </p>
              <p className="text-sm text-gray-500">Depósitos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-(--color-verde)/15 rounded-lg">
              <Warehouse className="w-6 h-6 text-(--color-verde)" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.depositosActivos}
              </p>
              <p className="text-sm text-gray-500">Activos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Warehouse className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.capacidadTotal}
              </p>
              <p className="text-sm text-gray-500">Capacidad Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Warehouse className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.vehiculosEnDepositos}
              </p>
              <p className="text-sm text-gray-500">Vehículos en Depósitos</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);

const DepositsTable = ({
  loading,
  filteredDepositos,
  paginatedDepositos,
  searchTerm,
  onSearchChange,
  getStatusColor,
  onViewDetails,
  onToggleStatus,
  pagination,
  currentUser,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-4 sm:p-6 border-b border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900">
          Depósitos Registrados
        </h2>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar por concesionario, municipio..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none w-full md:w-80"
          />
        </div>
      </div>
    </div>

    {loading ? (
      <TableSkeleton rows={5} columns={6} />
    ) : filteredDepositos.length === 0 ? (
      <div className="p-12 text-center">
        <Warehouse className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">
          {searchTerm
            ? "No se encontraron depósitos con esos criterios."
            : "No hay depósitos registrados."}
        </p>
        <p className="text-sm text-gray-400">
          Haz clic en "Registrar" para comenzar.
        </p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        {/* Table view for md+ screens */}
        <table className="hidden md:table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                  No. <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Concesionario
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Municipio
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estatus
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedDepositos.map((deposito) => (
              <tr
                key={deposito.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-(--color-primary)">
                    {deposito.numero}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {deposito.nombrePropietario}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">
                    {deposito.municipio}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-sm text-gray-500">
                    {deposito.direccion}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${deposito.activo ? 'bg-(--color-verde)/15 text-(--color-verde)' : 'bg-(--color-rosa)/15 text-(--color-rosa)'}`}>
                    {deposito.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ActionMenu 
                      options={[
                        { label: 'Ver Detalles', icon: Eye, onClick: () => onViewDetails(deposito) },
                        { label: deposito.activo ? 'Desactivar Depósito' : 'Activar Depósito', icon: deposito.activo ? Ban : Check, onClick: () => onToggleStatus(deposito), danger: deposito.activo, success: !deposito.activo, hidden: currentUser?.rol !== 'SUPER_USUARIO' }
                      ]}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Card view for smaller screens */}
        <div className="md:hidden flex flex-col divide-y divide-gray-100">
          {paginatedDepositos.map((deposito) => (
            <div
              key={deposito.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              {/* Top row: Name, Number, Status */}
              <div className="flex justify-between items-start mb-3">
                <div className="pr-2">
                  <span className="text-sm font-medium text-(--color-primary) mb-0.5 block">
                    #{deposito.numero}
                  </span>
                  <div className="text-sm font-semibold text-gray-900 leading-tight">
                    {deposito.nombrePropietario}
                  </div>
                </div>
                <span className={`shrink-0 ml-2 px-2 py-0.5 inline-flex text-[10px] font-semibold rounded-full ${deposito.activo ? 'bg-(--color-verde)/15 text-(--color-verde)' : 'bg-(--color-rosa)/15 text-(--color-rosa)'}`}>
                  {deposito.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {/* Middle row: Info details */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <p className="font-semibold text-gray-500 mb-0.5">
                    Municipio
                  </p>
                  <p
                    className="text-gray-900 truncate"
                    title={deposito.municipio}
                  >
                    {deposito.municipio}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500 mb-0.5">
                    Dirección
                  </p>
                  <p
                    className="text-gray-900 truncate"
                    title={deposito.direccion}
                  >
                    {deposito.direccion}
                  </p>
                </div>
              </div>

              {/* Bottom row: Actions */}
              <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-gray-50">
                <ActionMenu 
                  options={[
                    { label: 'Ver Detalles', icon: Eye, onClick: () => onViewDetails(deposito) },
                    { label: deposito.activo ? 'Desactivar Depósito' : 'Activar Depósito', icon: deposito.activo ? Ban : Check, onClick: () => onToggleStatus(deposito), danger: deposito.activo, success: !deposito.activo, hidden: currentUser?.rol !== 'SUPER_USUARIO' }
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Table Footer */}
    {filteredDepositos.length > 0 && (
      <Pagination 
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.itemsPerPage}
        currentPage={pagination.currentPage}
        onPageChange={pagination.onPageChange}
      />
    )}
  </div>
);

const DepositsPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isFormOpen, depositos, stats, loading, searchTerm, toast, confirmModal } = state;

  const navigate = useNavigate();

  const currentUserStr = sessionStorage.getItem("user") || localStorage.getItem("user");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  const showToast = (message, type = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
  };

  const fetchData = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");

      const [depositosRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/depositos`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/depositos/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [depositosData, statsData] = await Promise.all([
        depositosRes.json(),
        statsRes.json()
      ]);

      dispatch({
        type: "SET_DATA",
        payload: {
          depositos: depositosData.success ? depositosData.data : undefined,
          stats: statsData.success ? statsData.data : undefined,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormSuccess = () => {
    fetchData();
  };

  const openConfirmModal = (depositoId, currentStatus) => {
    dispatch({ type: 'OPEN_CONFIRM', payload: { depositoId, currentStatus } });
  };

  const closeConfirmModal = () => {
    dispatch({ type: 'CLOSE_CONFIRM' });
  };

  const handleToggleStatus = async () => {
    if (!confirmModal.depositoId) return;
    
    const { depositoId } = confirmModal;
    closeConfirmModal();

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/depositos/${depositoId}/toggle-status`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        await fetchData();
        showToast(data.message || 'Estado actualizado', 'success');
      } else {
        showToast(data.message || 'Error al cambiar estado', 'error');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Error de conexión al cambiar estado', 'error');
    }
  };

  const handleViewDetails = (deposito) => {
    navigate(`/dashboard/auditoria/${deposito.id}`);
  };

  const filteredDepositos = depositos.filter(
    (d) =>
      d.nombrePropietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.numero.includes(searchTerm),
  );

  const paginatedDepositos = filteredDepositos.slice(
    (state.currentPage - 1) * state.itemsPerPage,
    state.currentPage * state.itemsPerPage
  );

  return (
    <div className="space-y-4 md:space-y-8">
      <DepositsHeader
        loading={loading}
        onRefresh={fetchData}
        onNew={() => dispatch({ type: "SET_FORM_OPEN", payload: true })}
      />

      <DepositsStats loading={loading} stats={stats} />

      <DepositsTable
        loading={loading}
        filteredDepositos={filteredDepositos}
        paginatedDepositos={paginatedDepositos}
        searchTerm={searchTerm}
        onSearchChange={(e) =>
          dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
        }
        onViewDetails={handleViewDetails}
        onToggleStatus={(dep) => openConfirmModal(dep.id, dep.activo)}
        pagination={{
          totalItems: filteredDepositos.length,
          itemsPerPage: state.itemsPerPage,
          currentPage: state.currentPage,
          onPageChange: (page) => dispatch({ type: "SET_PAGE", payload: page }),
        }}
        currentUser={currentUser}
      />

      {/* Deposit Registration Form Modal */}
      <DepositRegistrationForm
        isOpen={isFormOpen}
        onClose={() => dispatch({ type: "SET_FORM_OPEN", payload: false })}
        onSuccess={handleFormSuccess}
      />

      <ConfirmStatusModal
        isOpen={confirmModal.isOpen}
        currentStatus={confirmModal.currentStatus}
        onClose={closeConfirmModal}
        onConfirm={handleToggleStatus}
      />

      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => dispatch({ type: 'HIDE_TOAST' })} 
      />
    </div>
  );
};

export default DepositsPage;
