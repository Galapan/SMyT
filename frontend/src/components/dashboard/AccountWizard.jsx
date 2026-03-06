import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import StepIndicator from './VehicleRegistrationForm/components/UI/StepIndicator';
import ModalHeader from './VehicleRegistrationForm/components/UI/ModalHeader';
import NavigationFooter from './VehicleRegistrationForm/components/UI/NavigationFooter';

const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

const AccountWizard = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState('right');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [depositos, setDepositos] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: '',
    depositoId: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setDirection('right');
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol: '',
        depositoId: ''
      });
      setErrors({});
      setError(null);
      fetchDepositos();
    }
  }, [isOpen]);

  const fetchDepositos = async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/depositos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDepositos(data.data);
      }
    } catch (error) {
      console.error('Error fetching depositos:', error);
    }
  };

  const steps = [
    { id: 1, name: 'Datos Personales', icon: User },
    { id: 2, name: 'Rol y Asignación', icon: Shield },
    { id: 3, name: 'Confirmación', icon: CheckCircle }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
      if (!formData.apellido) newErrors.apellido = 'El apellido es requerido';
      if (!formData.email) {
        newErrors.email = 'El email es requerido';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
      if (!formData.password) {
         newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
         newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
    }
    if (step === 2) {
      if (!formData.rol) newErrors.rol = 'Debe seleccionar un rol';
      if (formData.rol === 'USUARIO_CONCESIONARIO' && !formData.depositoId) {
        newErrors.depositoId = 'Debe seleccionar un depósito';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setDirection('right');
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setDirection('left');
    setCurrentStep(prev => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Si cambia el rol y no es concesionario, limpiar el depositoId
    if (name === 'rol' && value !== 'USUARIO_CONCESIONARIO') {
        setFormData(prev => ({ ...prev, depositoId: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return; // Although step 3 has no inputs, just to be safe
    
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.data);
        onClose();
      } else {
        setError(data.message || 'Error al crear el usuario');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => `
    w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none transition-all
    ${errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}
  `;

  if (!isOpen) return null;

  // Render Step 1
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={getInputClass('nombre')}
            placeholder="Ej. Juan"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className={getInputClass('apellido')}
              placeholder="Ej. Pérez"
            />
            {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={getInputClass('email')}
              placeholder="correo@ejemplo.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={getInputClass('password')}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
      </div>
    </div>
  );

  // Render Step 2
  const renderStep2 = () => {
    const activeUser = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user'));
    const isSuperAdmin = activeUser?.rol === 'SUPER_USUARIO';

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asignación de Roles y Permisos</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol del Usuario *</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className={getInputClass('rol')}
            >
              <option value="">Seleccione un rol...</option>
              {isSuperAdmin && <option value="SUPER_USUARIO">Super Usuario</option>}
              {isSuperAdmin && <option value="ADMINISTRADOR_SMYT">Administrador SMyT</option>}
              <option value="USUARIO_CONCESIONARIO">Usuario Concesionario</option>
            </select>
            {errors.rol && <p className="text-red-500 text-xs mt-1">{errors.rol}</p>}
          </div>

          {formData.rol === 'USUARIO_CONCESIONARIO' && (
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asignar a Depósito Vehicular *</label>
                <select
                  name="depositoId"
                  value={formData.depositoId}
                  onChange={handleChange}
                  className={getInputClass('depositoId')}
                >
                  <option value="">Seleccione un depósito...</option>
                  {depositos.map(deposito => (
                    <option key={deposito.id} value={deposito.id}>
                      {deposito.nombre} - {deposito.municipio}
                    </option>
                  ))}
                </select>
                {errors.depositoId && <p className="text-red-500 text-xs mt-1">{errors.depositoId}</p>}
             </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6 text-center py-2">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">Confirmar Creación</h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        Revisa que la información sea correcta antes de crear la cuenta. 
        El usuario podrá iniciar sesión inmediatamente.
      </p>

      <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto mt-6 border border-gray-100">
        <div className="space-y-3">
          <p><span className="font-semibold text-gray-700">Nombre:</span> {formData.nombre} {formData.apellido}</p>
          <p><span className="font-semibold text-gray-700">Email:</span> {formData.email}</p>
          <p>
            <span className="font-semibold text-gray-700">Rol:</span>{' '} 
            <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-md text-sm font-medium">
              {formData.rol.replace('_', ' ')}
            </span>
          </p>
          {formData.rol === 'USUARIO_CONCESIONARIO' && (
            <p><span className="font-semibold text-gray-700">Depósito:</span> {depositos.find(d => d.id === formData.depositoId)?.nombre}</p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-800/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-slide-up-fade flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="shrink-0 bg-white z-10 px-8 pt-6 pb-4 border-b border-gray-100">
          <ModalHeader onClose={onClose} title="Creación de Cuentas" />

          {/* Stepper */}
          <div className="mt-6">
            <StepIndicator steps={steps} currentStep={currentStep} />
          </div>
        </div>

        {/* Global Error */}
        {error && (
          <div className="mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6">
          <div 
            key={currentStep}
            className={`${direction === 'right' ? 'animate-slide-right' : 'animate-slide-left'}`}
          >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="shrink-0">
        <NavigationFooter 
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={prevStep}
          onNext={nextStep}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Crear Cuenta"
        />
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  );
};

export default AccountWizard;
