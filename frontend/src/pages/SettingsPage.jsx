import { useReducer, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User, Lock, Save, Camera, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import ImageCropper from '../components/common/ImageCropper';
import Toast from '../components/common/Toast';
import PasswordValidation from '../components/common/PasswordValidation';
import Skeleton from '../components/common/Skeleton';

const initialState = {
  activeTab: 'profile',
  isSubmittingProfile: false,
  isSubmittingPassword: false,
  message: null,
  fotoUrl: null,
  selectedImage: null,
  showCropper: false,
  passwords: { currentPassword: '', newPassword: '', confirmPassword: '' },
  editData: { nombre: '', apellido: '' }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.payload, message: null };
    case 'SET_SUBMITTING_PROFILE':
      return { ...state, isSubmittingProfile: action.payload };
    case 'SET_SUBMITTING_PASSWORD':
      return { ...state, isSubmittingPassword: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_PHOTO_DATA':
      return { ...state, fotoUrl: action.payload };
    case 'SHOW_CROPPER':
      return { ...state, showCropper: true, selectedImage: action.payload };
    case 'HIDE_CROPPER':
      return { ...state, showCropper: false, selectedImage: null };
    case 'SET_PASSWORDS':
      return { ...state, passwords: { ...state.passwords, ...action.payload } };
    case 'SET_EDIT_DATA':
      return { ...state, editData: { ...state.editData, ...action.payload } };
    case 'RESET_PASSWORDS':
      return { ...state, passwords: { currentPassword: '', newPassword: '', confirmPassword: '' } };
    case 'SYNC_PROFILE':
      return { ...state, editData: { nombre: action.payload.nombre, apellido: action.payload.apellido }, fotoUrl: action.payload.fotoUrl };
    default:
      return state;
  }
}

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { activeTab, isSubmittingProfile, isSubmittingPassword, message, fotoUrl, selectedImage, showCropper, passwords, editData } = state;

  // Helper para obtener el token esté donde esté guardado
  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  // Helper para obtener el usuario actual
  const getCurrentUser = () => {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  };

  const currentUser = getCurrentUser();

  const fetchProfile = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : (import.meta.env.DEV ? "http://localhost:3000" : "")}/api/users/profile`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    throw new Error('Error fetching profile');
  };

  const { data: profile = { nombre: '', apellido: '', email: '', rol: '', fotoUrl: '' }, isLoading: loading } = useQuery({
    queryKey: ['userProfile', currentUser?.id],
    queryFn: fetchProfile,
    enabled: !!currentUser?.id, // Solo ejecutar si hay usuario autenticado
  });

  // Resetear estado local cuando cambie el usuario
  useEffect(() => {
    if (currentUser?.id) {
      // Solo sincronizar si hay un usuario válido
      if (profile.nombre) {
        dispatch({ type: 'SYNC_PROFILE', payload: profile });
      }
    } else {
      // Si no hay usuario, resetear el estado
      dispatch({ type: 'SYNC_PROFILE', payload: { nombre: '', apellido: '', fotoUrl: '' } });
    }
  }, [profile, currentUser?.id]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_SUBMITTING_PROFILE', payload: true });
    dispatch({ type: 'SET_MESSAGE', payload: null });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : (import.meta.env.DEV ? "http://localhost:3000" : "")}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          nombre: editData.nombre,
          apellido: editData.apellido,
          fotoUrl: fotoUrl
        })
      });

      const result = await response.json();

      if (result.success) {
        dispatch({ type: 'SET_MESSAGE', payload: { type: 'success', text: 'Perfil actualizado correctamente' } });
        // Actualizar datos en sesión para que el layout se entere (si lee de storage)
        const updatedUser = { ...JSON.parse(sessionStorage.getItem('user')), ...result.data };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('user', JSON.stringify(updatedUser));

        queryClient.invalidateQueries({ queryKey: ['userProfile', currentUser?.id] });

        // Disparar evento para actualizar layout
        window.dispatchEvent(new Event('storage'));
      } else {
        dispatch({ type: 'SET_MESSAGE', payload: { type: 'error', text: result.message || 'Error al actualizar perfil' } });
      }
    } catch (error) {
      dispatch({ type: 'SET_MESSAGE', payload: { type: 'error', text: 'Error de conexión' } });
    } finally {
      dispatch({ type: 'SET_SUBMITTING_PROFILE', payload: false });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      dispatch({ type: 'SET_MESSAGE', payload: { type: 'error', text: 'las contraseñas nuevas no coinciden' } });
      return;
    }
    
    dispatch({ type: 'SET_SUBMITTING_PASSWORD', payload: true });
    dispatch({ type: 'SET_MESSAGE', payload: null });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : (import.meta.env.DEV ? "http://localhost:3000" : "")}/api/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });

      const result = await response.json();

      if (result.success) {
        dispatch({ type: 'SET_MESSAGE', payload: { type: 'success', text: 'Contraseña actualizada correctamente' } });
        dispatch({ type: 'RESET_PASSWORDS' });
      } else {
        dispatch({ type: 'SET_MESSAGE', payload: { type: 'error', text: result.message || 'Error al cambiar contraseña' } });
      }
    } catch (error) {
      dispatch({ type: 'SET_MESSAGE', payload: { type: 'error', text: 'Error de conexión' } });
    } finally {
      dispatch({ type: 'SET_SUBMITTING_PASSWORD', payload: false });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({ type: 'SHOW_CROPPER', payload: reader.result });
      };
      reader.readAsDataURL(file);
    }
    // clear input so same file can be selected again
    e.target.value = null; 
  };

  const handleCropComplete = (croppedImageFileUrl) => {
    dispatch({ type: 'SET_PHOTO_DATA', payload: croppedImageFileUrl });
    dispatch({ type: 'HIDE_CROPPER' });
  };

  const handleCropCancel = () => {
    dispatch({ type: 'HIDE_CROPPER' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Configuración de Cuenta</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'profile' })}
          className={`pb-4 px-4 font-medium transition-colors relative ${
            activeTab === 'profile' 
              ? 'text-(--color-primary) border-b-2 border-(--color-primary)' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <User size={20} />
            <span>Mi Perfil</span>
          </div>
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'security' })}
          className={`pb-4 px-4 font-medium transition-colors relative ${
            activeTab === 'security' 
              ? 'text-(--color-primary) border-b-2 border-(--color-primary)' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Lock size={20} />
            <span>Seguridad</span>
          </div>
        </button>
      </div>

      {/* Message Alert => Reemplazado por Toast Global */}
      <Toast 
        show={!!message}
        message={message?.text}
        type={message?.type || 'success'}
        onClose={() => dispatch({ type: 'SET_MESSAGE', payload: null })}
      />

      {/* Profile Content */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in min-h-100">
          {loading ? (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Skeleton */}
              <div className="flex flex-col items-center space-y-4">
                <Skeleton width="8rem" height="8rem" circle={true} />
              </div>
              
              {/* Form Fields Skeleton */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Skeleton width="4rem" height="1rem" className="mb-2" />
                    <Skeleton height="2.625rem" />
                  </div>
                  <div>
                    <Skeleton width="5rem" height="1rem" className="mb-2" />
                    <Skeleton height="2.625rem" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Skeleton width="3.5rem" height="1rem" className="mb-2" />
                    <Skeleton height="2.625rem" />
                  </div>
                  <div>
                    <Skeleton width="2rem" height="1rem" className="mb-2" />
                    <Skeleton height="2.625rem" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Skeleton width="13rem" height="2.75rem" />
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="animate-fade-in">
              <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
                    <img 
                      src={fotoUrl || profile.fotoUrl || `https://ui-avatars.com/api/?background=random&color=fff&name=${profile.nombre}+${profile.apellido}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200 group-hover:scale-110">
                    <Camera size={18} className="text-gray-600" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="editData.nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      id="editData.nombre"
                      type="text"
                      value={editData.nombre}
                      onChange={(e) => dispatch({ type: 'SET_EDIT_DATA', payload: { nombre: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-shadow outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="editData.apellido" className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                    <input
                      id="editData.apellido"
                      type="text"
                      value={editData.apellido}
                      onChange={(e) => dispatch({ type: 'SET_EDIT_DATA', payload: { apellido: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-shadow outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="profile.email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      id="profile.email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile.rol" className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                    <input
                      id="profile.rol"
                      type="text"
                      value={profile.rol}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingProfile}
                    className="flex items-center space-x-2 bg-(--color-primary) text-white px-8 py-2.5 rounded-lg hover:brightness-90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {isSubmittingProfile ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
          )}
        </div>
      )}

      {/* Security Content */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl animate-fade-in">
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="passwords.currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
              <input
                id="passwords.currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => dispatch({ type: 'SET_PASSWORDS', payload: { currentPassword: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-shadow outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="passwords.newPassword" className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
              <input
                id="passwords.newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={(e) => dispatch({ type: 'SET_PASSWORDS', payload: { newPassword: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-shadow outline-none"
                required
                minLength={8}
              />
              <PasswordValidation password={passwords.newPassword} />
            </div>

            <div>
              <label htmlFor="passwords.confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
              <input
                id="passwords.confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => dispatch({ type: 'SET_PASSWORDS', payload: { confirmPassword: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-shadow outline-none"
                required
                minLength={6}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingPassword}
                className="flex items-center space-x-2 bg-(--color-primary) text-white px-8 py-2.5 rounded-lg hover:brightness-90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isSubmittingPassword ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                <span>Actualizar Contraseña</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showCropper && selectedImage && (
        <ImageCropper 
          imageSrc={selectedImage} 
          onCropComplete={handleCropComplete} 
          onCancel={handleCropCancel} 
        />
      )}
    </div>
  );
};

export default SettingsPage;
