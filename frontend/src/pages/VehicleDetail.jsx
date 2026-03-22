import { useReducer } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageIcon } from 'lucide-react';
import Toast from '../components/common/Toast';
import RequestCorrectionModal from '../components/dashboard/RequestCorrectionModal';
import VehicleHeader from '../components/dashboard/VehicleDetail/VehicleHeader';
import VehicleGallery from '../components/dashboard/VehicleDetail/VehicleGallery';
import VehicleIdentityCard from '../components/dashboard/VehicleDetail/VehicleIdentityCard';
import VehicleLegalCard from '../components/dashboard/VehicleDetail/VehicleLegalCard';
import VehicleInspectionCard from '../components/dashboard/VehicleDetail/VehicleInspectionCard';
import VehicleImageModal from '../components/dashboard/VehicleDetail/VehicleImageModal';

const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

const initialState = {
  showEditModal: false,
  toast: { visible: false, message: '', type: 'success' },
  selectedImage: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_EDIT_MODAL':
      return { ...state, showEditModal: action.payload };
    case 'SHOW_TOAST':
      return { ...state, toast: { visible: true, message: action.payload.message, type: action.payload.type } };
    case 'HIDE_TOAST':
      return { ...state, toast: { ...state.toast, visible: false } };
    case 'SET_SELECTED_IMAGE':
      return { ...state, selectedImage: action.payload };
    default:
      return state;
  }
}

// Configuración de física de resortes para Framer Motion
const springConfig = {
  type: 'spring',
  damping: 25,
  stiffness: 300,
  mass: 0.8
};

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userRol = user?.rol || '';

  const [state, dispatch] = useReducer(reducer, initialState);
  const { showEditModal, toast, selectedImage } = state;

  const showNotification = (message, type = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
    setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 4000);
  };

  const fetchVehicleData = async () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/vehiculos/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    } else {
      navigate('/dashboard/auditoria');
      throw new Error('Vehicle not found');
    }
  };

  const { data: vehiculo, isLoading: loading } = useQuery({
    queryKey: ['vehiculo', id],
    queryFn: fetchVehicleData,
    enabled: !!id,
  });

  if (loading) {
    return (
      <div className="h-full flex flex-col space-y-6 animate-pulse">
        <div className="h-20 w-full bg-white rounded-xl border border-gray-100"></div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white rounded-xl border border-gray-100"></div>
          <div className="lg:col-span-1 h-96 bg-white rounded-xl border border-gray-100"></div>
        </div>
      </div>
    );
  }

  if (!vehiculo) return null;

  return (
    <LazyMotion features={domAnimation}>
      <div className="h-full flex flex-col space-y-6 overflow-y-auto pb-4">
        
        <VehicleHeader
          vehiculo={vehiculo}
          userRol={userRol}
          onBack={() => navigate(-1)}
          onEditRequest={() => dispatch({ type: 'SET_EDIT_MODAL', payload: true })}
        />

        <div className="flex-1 pb-6 space-y-6">
          {/* Galería Fotográfica */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <ImageIcon size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-800">Evidencia Fotográfica</h3>
            </div>
            <div className="p-6">
              <VehicleGallery
                fotos={vehiculo.fotos}
                selectedImage={selectedImage}
                springConfig={springConfig}
                onImageSelect={(foto) => dispatch({ type: 'SET_SELECTED_IMAGE', payload: foto })}
              />
            </div>
          </div>

          {/* Filas de Información */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <VehicleIdentityCard vehiculo={vehiculo} />
            <VehicleLegalCard vehiculo={vehiculo} />
            <VehicleInspectionCard vehiculo={vehiculo} />
          </div>
        </div>

        <RequestCorrectionModal
          isOpen={showEditModal}
          onClose={() => dispatch({ type: 'SET_EDIT_MODAL', payload: false })}
          vehiculo={vehiculo}
          onSuccess={(msg) => {
            dispatch({ type: 'SET_EDIT_MODAL', payload: false });
            showNotification(msg, 'success');
          }}
        />

        <Toast
          show={toast.visible}
          message={toast.message}
          type={toast.type}
          onClose={() => dispatch({ type: 'HIDE_TOAST' })}
        />

        <VehicleImageModal
          selectedImage={selectedImage}
          springConfig={springConfig}
          onClose={() => dispatch({ type: 'SET_SELECTED_IMAGE', payload: null })}
        />
      </div>
    </LazyMotion>
  );
};

export default VehicleDetail;
