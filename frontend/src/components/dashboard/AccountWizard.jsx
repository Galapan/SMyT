import { useState, useEffect, useReducer } from 'react';
import { createPortal } from 'react-dom';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { User, Shield, CheckCircle } from 'lucide-react';
import StepIndicator from './VehicleRegistrationForm/components/UI/StepIndicator';
import ModalHeader from './VehicleRegistrationForm/components/UI/ModalHeader';
import NavigationFooter from './VehicleRegistrationForm/components/UI/NavigationFooter';
import Toast from "../common/Toast";
import PersonalInfoStep from './AccountWizard/PersonalInfoStep';
import RoleAssignmentStep from './AccountWizard/RoleAssignmentStep';
import ConfirmationStep from './AccountWizard/ConfirmationStep';

const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

const initialState = {
  currentStep: 1,
  direction: 'right',
  loading: false,
  error: null,
  errors: {},
  formData: {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: '',
    depositoId: ''
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return { ...initialState };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload.step, direction: action.payload.direction };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'UPDATE_FORM':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'CLEAR_FIELD_ERROR':
      return { ...state, errors: { ...state.errors, [action.payload]: null } };
    default:
      return state;
  }
}

const AccountWizard = ({ isOpen, onClose, onSuccess }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentStep, direction, loading, error, errors, formData } = state;
  const [depositos, setDepositos] = useState([]);

  useEffect(() => {
    fetchDepositos();
  }, []);

  const handleClose = () => {
    dispatch({ type: 'RESET' });
    onClose();
  };

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
    }
    dispatch({ type: 'SET_ERRORS', payload: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      dispatch({ type: 'SET_STEP', payload: { step: currentStep + 1, direction: 'right' } });
    }
  };

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', payload: { step: currentStep - 1, direction: 'left' } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FORM', payload: { [name]: value } });
    if (errors[name]) {
      dispatch({ type: 'CLEAR_FIELD_ERROR', payload: name });
    }
    
    // Si cambia el rol y no es concesionario, limpiar el depositoId
    if (name === 'rol' && value !== 'ADMINISTRADOR_CONCESIONARIO') {
        dispatch({ type: 'UPDATE_FORM', payload: { depositoId: '' } });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return; // Although step 3 has no inputs, just to be safe
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

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
        dispatch({ type: 'RESET' });
        onSuccess(data.data);
        onClose();
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message || 'Error al crear el usuario' });
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Error de conexión con el servidor' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
  };

  return createPortal(
    <LazyMotion features={domAnimation}>
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
          {/* Backdrop */}
          <m.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-gray-800/40 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <m.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] z-10">
        
        {/* Header */}
        <div className="shrink-0 bg-white z-10 px-8 pt-6 pb-4 border-b border-gray-100">
          <ModalHeader onClose={handleClose} title="Creación de Cuentas" />

          {/* Stepper */}
          <div className="mt-6">
            <StepIndicator steps={steps} currentStep={currentStep} />
          </div>
        </div>

        {/* Global Error */}
        <Toast 
          show={!!error}
          message={error}
          type="error"
          onClose={() => dispatch({ type: 'SET_ERROR', payload: null })}
        />

        {/* Form Content */}
        <div className="overflow-y-auto px-8 py-6">
          <div
            key={currentStep}
            className={`${direction === 'right' ? 'animate-slide-right' : 'animate-slide-left'}`}
          >
            {currentStep === 1 && (
              <PersonalInfoStep
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />
            )}
            {currentStep === 2 && (
              <RoleAssignmentStep
                formData={formData}
                errors={errors}
                depositos={depositos}
                onChange={handleChange}
              />
            )}
            {currentStep === 3 && (
              <ConfirmationStep
                formData={formData}
                depositos={depositos}
              />
            )}
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
          </m.div>
        </div>
      )}
    </AnimatePresence>
    </LazyMotion>,
    document.getElementById('modal-root') || document.body
  );
};

export default AccountWizard;
