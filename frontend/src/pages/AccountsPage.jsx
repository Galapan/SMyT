import { useReducer, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, RefreshCw, Search, Eye, MoreVertical, Shield, Power, Check, AlertCircle, X, AlertTriangle, Trash2 } from 'lucide-react';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { formatRole } from '../utils/formatRole';
import AccountWizard from '../components/dashboard/AccountWizard';
import AccountDetailsModal from '../components/dashboard/AccountDetailsModal';
import ActionMenu from '../components/common/ActionMenu';
import TableSkeleton from '../components/common/TableSkeleton';
import StatsSkeleton from '../components/common/StatsSkeleton';
import Pagination from '../components/common/Pagination';

const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

const AccountsHeader = ({ loading, onRefresh, onNewAccount }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Gestión de Cuentas</h1>
      <p className="text-gray-500">Administra los accesos al sistema y sus roles.</p>
    </div>
    <div className="flex gap-3">
      <button 
        onClick={onRefresh}
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-medium"
      >
        <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
        Actualizar
      </button>
      <button 
        onClick={onNewAccount}
        className="px-4 py-2 bg-(--color-primary) hover:bg-violet-900 text-white rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center font-medium"
      >
        <Plus size={20} className="mr-2" />
        Nueva Cuenta
      </button>
    </div>
  </div>
);

const AccountsStats = ({ loading, stats }) => (
  <>
    {loading ? (
      <StatsSkeleton cards={4} />
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-100 rounded-lg">
              <Users className="w-6 h-6 text-(--color-primary)" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Usuarios</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-(--color-rojo)/10 rounded-lg">
              <Shield className="w-6 h-6 text-(--color-rojo)" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.superAdmins}</p>
              <p className="text-sm text-gray-500">Super usuarios</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-(--color-azul)/10 rounded-lg">
              <Shield className="w-6 h-6 text-(--color-azul)" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
              <p className="text-sm text-gray-500">Administradores</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-(--color-verde)/10 rounded-lg">
              <Users className="w-6 h-6 text-(--color-verde)" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.concesionarios}</p>
              <p className="text-sm text-gray-500">Adm. Concesionarios</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);

const AccountsTable = ({
  loading,
  filteredUsers,
  paginatedUsers,
  searchTerm,
  onSearchChange,
  getRoleColor,
  getRoleLabel,
  onViewDetails,
  onToggleStatus,
  onDelete,
  pagination,
  currentUser
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-4 sm:p-6 border-b border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900">Usuarios Activos</h2>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, rol..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none w-full md:w-80"
          />
        </div>
      </div>
    </div>

    {loading ? (
      <TableSkeleton rows={5} columns={6} />
    ) : filteredUsers.length === 0 ? (
      <div className="p-12 text-center">
        <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">
          {searchTerm ? 'No se encontraron usuarios con esos criterios.' : 'No hay usuarios registrados.'}
        </p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        {/* Table view for md+ screens */}
        <table className="hidden md:table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depósito</th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
              <th className="px-4 py-3 sm:px-6 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* Avatar */}
                    <div className="h-10 w-10 shrink-0 rounded-full border border-gray-200 bg-white overflow-hidden shadow-sm">
                      <img 
                        src={(user.fotoUrl && !user.fotoUrl.includes('name=User')) ? user.fotoUrl : `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(user.nombre + ' ' + user.apellido)}`} 
                        alt="avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.nombre} {user.apellido}</div>
                      <div className="text-xs text-gray-500">Agregado: {new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">{user.email}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.rol)}`}>
                    {getRoleLabel(user.rol)}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">{user.deposito?.nombre || '-'}</span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${user.activo ? 'bg-(--color-verde)/15 text-(--color-verde)' : 'bg-(--color-rojo)/15 text-(--color-rojo)'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.activo ? 'bg-(--color-verde)' : 'bg-(--color-rojo)'}`}></span>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end">
                    <ActionMenu 
                      options={[
                        { label: 'Ver Detalles', icon: Eye, onClick: () => onViewDetails(user) },
                        { label: user.activo ? 'Desactivar Cuenta' : 'Activar Cuenta', icon: Power, onClick: () => onToggleStatus(user), hidden: currentUser?.rol === 'ADMINISTRADOR_CONCESIONARIO' },
                        { label: 'Eliminar Cuenta', icon: Trash2, onClick: () => onDelete(user), danger: true, hidden: currentUser?.rol !== 'SUPER_USUARIO' }
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
          {paginatedUsers.map((user) => (
            <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
              {/* Top row: Avatar, Name, Status */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 shrink-0 rounded-full border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <img 
                      src={(user.fotoUrl && !user.fotoUrl.includes('name=User')) ? user.fotoUrl : `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(user.nombre + ' ' + user.apellido)}`} 
                      alt="avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{user.nombre} {user.apellido}</div>
                    <div className="text-xs text-gray-500">
                      <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded-md ${getRoleColor(user.rol)} mr-1.5`}>
                        {getRoleLabel(user.rol)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${user.activo ? 'bg-(--color-verde)/15 text-(--color-verde)' : 'bg-(--color-rojo)/15 text-(--color-rojo)'}`}>
                  <span className={`w-1 h-1 rounded-full ${user.activo ? 'bg-(--color-verde)' : 'bg-(--color-rojo)'}`}></span>
                  {user.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              {/* Middle row: Info details */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3 pl-13">
                <div>
                  <p className="font-semibold text-gray-500 mb-0.5">Contacto</p>
                  <p className="text-gray-900 truncate" title={user.email}>{user.email}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500 mb-0.5">Depósito</p>
                  <p className="text-gray-900 truncate" title={user.deposito?.nombre || '-'}>{user.deposito?.nombre || '-'}</p>
                </div>
              </div>
              
              {/* Bottom row: Actions */}
              <div className="flex items-center justify-end pt-3 border-t border-gray-50">
                <ActionMenu 
                  options={[
                    { label: 'Ver Detalles', icon: Eye, onClick: () => onViewDetails(user) },
                    { label: user.activo ? 'Desactivar Cuenta' : 'Activar Cuenta', icon: Power, onClick: () => onToggleStatus(user), hidden: currentUser?.rol === 'ADMINISTRADOR_CONCESIONARIO' },
                    { label: 'Eliminar Cuenta', icon: Trash2, onClick: () => onDelete(user), danger: true, hidden: currentUser?.rol !== 'SUPER_USUARIO' }
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Table Footer */}
    {filteredUsers.length > 0 && (
      <Pagination 
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.itemsPerPage}
        currentPage={pagination.currentPage}
        onPageChange={pagination.onPageChange}
      />
    )}
  </div>
);

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
                    ¿{currentStatus ? 'Desactivar' : 'Activar'} Cuenta?
                  </h3>
                  <p className="text-center text-gray-500 text-sm mb-6">
                    {currentStatus 
                      ? 'El usuario no podrá acceder al sistema hasta que su cuenta sea reactivada.' 
                      : 'El usuario recuperará su acceso al sistema de forma inmediata.'}
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

const DeleteUserModal = ({ isOpen, onClose, onConfirm }) => (
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
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-(--color-rojo)/15 text-(--color-rojo)">
                    <Trash2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                    Eliminar Cuenta
                  </h3>
                  <p className="text-center text-gray-500 text-sm mb-2">
                    ¿Estás seguro de que deseas eliminar a este usuario de forma permanente?
                  </p>
                  <p className="text-center text-(--color-rojo) opacity-90 font-semibold text-xs mb-6">
                    Esta acción no se puede deshacer.
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
                      className="flex-1 px-4 py-2.5 text-white font-medium rounded-xl transition-colors bg-(--color-rojo) opacity-90 hover:opacity-100"
                    >
                      Sí, Eliminar
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

const AccountsToast = ({ toast, onClose }) => (
  <>
    {createPortal(
      <AnimatePresence>
        {toast.show && (
          <LazyMotion features={domAnimation}>
            <m.div 
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`fixed top-4 right-4 z-110 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border bg-white ${
                toast.type === 'success' 
                  ? 'border-(--color-verde)/30 text-(--color-verde) bg-linear-to-r from-white to-(--color-verde)/5' 
                  : 'border-(--color-rojo)/30 text-(--color-rojo) bg-linear-to-r from-white to-(--color-rojo)/5'
              }`}
            >
              <div className={`flex shrink-0 w-8 h-8 rounded-full items-center justify-center ${
                toast.type === 'success' ? 'bg-(--color-verde)/20 text-(--color-verde)' : 'bg-(--color-rojo)/20 text-(--color-rojo)'
              }`}>
                {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
              </div>
              <p className="text-sm font-medium pr-4 text-gray-800">{toast.message}</p>
              <button 
                onClick={onClose}
                className={`p-1 rounded-md transition-colors ${
                  toast.type === 'success' ? 'hover:bg-(--color-verde)/20 text-(--color-verde)' : 'hover:bg-(--color-rojo)/20 text-(--color-rojo)'
                }`}
              >
                <X size={16} />
              </button>
            </m.div>
          </LazyMotion>
        )}
      </AnimatePresence>,
      document.getElementById('modal-root') || document.body
    )}
  </>
);

const initialState = {
  isFormOpen: false,
  isDetailsOpen: false,
  selectedUser: null,
  searchTerm: '',
  toast: { show: false, message: '', type: 'success' },
  confirmModal: { isOpen: false, userId: null, currentStatus: null },
  deleteModal: { isOpen: false, userId: null },
  currentPage: 1,
  itemsPerPage: 7,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FORM_OPEN':
      return { ...state, isFormOpen: action.payload };
    case 'SET_DETAILS_OPEN':
      return { ...state, isDetailsOpen: action.payload };
    case 'SET_SELECTED_USER':
      return { ...state, selectedUser: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SHOW_TOAST':
      return { ...state, toast: { show: true, message: action.payload.message, type: action.payload.type } };
    case 'HIDE_TOAST':
      return { ...state, toast: { ...state.toast, show: false } };
    case 'OPEN_CONFIRM':
      return { ...state, confirmModal: { isOpen: true, userId: action.payload.userId, currentStatus: action.payload.currentStatus } };
    case 'CLOSE_CONFIRM':
      return { ...state, confirmModal: { ...state.confirmModal, isOpen: false } };
    case 'OPEN_DELETE':
      return { ...state, deleteModal: { isOpen: true, userId: action.payload } };
    case 'CLOSE_DELETE':
      return { ...state, deleteModal: { ...state.deleteModal, isOpen: false } };
    default:
      return state;
  }
}

const AccountsPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isFormOpen, isDetailsOpen, selectedUser, searchTerm, toast, confirmModal, deleteModal } = state;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const showToast = (message, type = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 4000);
  };

  // Redirect if not SUPER_USUARIO
  useEffect(() => {
    const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.rol !== 'SUPER_USUARIO') {
        navigate('/admin');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchUsers = async () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const usersData = await res.json();
    if (!usersData.success) {
      throw new Error(usersData.message || 'Error fetching users');
    }
    return usersData.data;
  };

  const { data: users = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const loading = isLoading || isFetching;

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const openConfirmModal = (userId, currentStatus) => {
    dispatch({ type: 'OPEN_CONFIRM', payload: { userId, currentStatus } });
  };

  const closeConfirmModal = () => {
    dispatch({ type: 'CLOSE_CONFIRM' });
  };

  const handleToggleStatus = async () => {
    if (!confirmModal.userId) return;
    
    const { userId } = confirmModal;
    closeConfirmModal();

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/users/${userId}/status`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        await refetch(); // Force an immediate refresh
        showToast(data.message, 'success');
      } else {
        showToast(data.message || 'Error al cambiar estado de la cuenta', 'error');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Error de conexión al cambiar estado', 'error');
    }
  };

  const openDeleteModal = (userId) => {
    dispatch({ type: 'OPEN_DELETE', payload: userId });
  };

  const closeDeleteModal = () => {
    dispatch({ type: 'CLOSE_DELETE' });
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.userId) return;
    
    const { userId } = deleteModal;
    closeDeleteModal();

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        await refetch(); // Refresh the list
        showToast(data.message, 'success');
      } else {
        showToast(data.message || 'Error al eliminar la cuenta', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Error de conexión al intentar eliminar', 'error');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.rol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    return filteredUsers.slice(start, start + state.itemsPerPage);
  }, [filteredUsers, state.currentPage, state.itemsPerPage]);

  const getRoleLabel = (rol) => formatRole(rol);

  const getRoleColor = (rol) => {
    const colors = {
      'SUPER_USUARIO': 'bg-(--color-rojo)/10 text-(--color-rojo) shadow-[0_2px_10px_rgba(167,15,38,0.1)] font-bold border border-(--color-rojo)/20',
      'ADMINISTRADOR': 'bg-(--color-azul)/10 text-(--color-azul) shadow-[0_2px_10px_rgba(85,174,201,0.1)] font-bold border border-(--color-azul)/20',
      'ADMINISTRADOR_CONCESIONARIO': 'bg-(--color-verde)/15 text-(--color-verde) shadow-[0_2px_10px_rgba(111,178,37,0.1)] font-bold border border-(--color-verde)/20'
    };
    return colors[rol] || 'bg-gray-100 text-gray-700';
  };

  // currentUser
  const currentUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  // Stats
  const stats = useMemo(() => {
    return {
      total: users.length,
      superAdmins: users.filter(u => u.rol === 'SUPER_USUARIO').length,
      admins: users.filter(u => u.rol === 'ADMINISTRADOR').length,
      concesionarios: users.filter(u => u.rol === 'ADMINISTRADOR_CONCESIONARIO').length,
    };
  }, [users]);

  return (
    <div className="space-y-4 md:space-y-8">
      <AccountsHeader
        loading={loading}
        onRefresh={() => refetch()}
        onNewAccount={() => dispatch({ type: 'SET_FORM_OPEN', payload: true })}
      />

      <AccountsStats loading={loading} stats={stats} />

      <AccountsTable
        loading={loading}
        filteredUsers={filteredUsers}
        paginatedUsers={paginatedUsers}
        searchTerm={searchTerm}
        onSearchChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
        getRoleColor={getRoleColor}
        getRoleLabel={getRoleLabel}
        onViewDetails={(user) => { dispatch({ type: 'SET_SELECTED_USER', payload: user }); dispatch({ type: 'SET_DETAILS_OPEN', payload: true }); }}
        onToggleStatus={(user) => openConfirmModal(user.id, user.activo)}
        onDelete={(user) => openDeleteModal(user.id)}
        pagination={{
          totalItems: filteredUsers.length,
          itemsPerPage: state.itemsPerPage,
          currentPage: state.currentPage,
          onPageChange: (page) => dispatch({ type: 'SET_PAGE', payload: page }),
        }}
        currentUser={currentUser}
      />

      {/* Wizard Modal */}
      <AccountWizard 
        isOpen={isFormOpen} 
        onClose={() => dispatch({ type: 'SET_FORM_OPEN', payload: false })}
        onSuccess={handleFormSuccess}
      />

      {/* Details Modal */}
      <AccountDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => dispatch({ type: 'SET_DETAILS_OPEN', payload: false })}
        user={selectedUser}
      />

      <ConfirmStatusModal
        isOpen={confirmModal.isOpen}
        currentStatus={confirmModal.currentStatus}
        onClose={closeConfirmModal}
        onConfirm={handleToggleStatus}
      />

      <DeleteUserModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteUser}
      />

      <AccountsToast toast={toast} onClose={() => dispatch({ type: 'HIDE_TOAST' })} />
    </div>
  );
};

export default AccountsPage;
