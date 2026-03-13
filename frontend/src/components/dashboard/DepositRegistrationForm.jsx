import { useReducer } from "react";
import { createPortal } from "react-dom";
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import {
  Building2,
  User,
  AlertCircle,
} from "lucide-react";

// Reuse components from VehicleRegistrationForm for consistency
import FormInput from "./VehicleRegistrationForm/components/FormFields/FormInput";
import FormSelect from "./VehicleRegistrationForm/components/FormFields/FormSelect";
import ModalHeader from "./VehicleRegistrationForm/components/UI/ModalHeader";
import StepIndicator from "./VehicleRegistrationForm/components/UI/StepIndicator";
import NavigationFooter from "./VehicleRegistrationForm/components/UI/NavigationFooter";
import Toast from "../common/Toast";

const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

const initialState = {
  currentStep: 1,
  direction: "right",
  loading: false,
  error: "",
  errors: {},
  formData: {
    nombreDeposito: "",
    municipio: "",
    direccion: "",
    capacidad: "",
    telefono: "",
    nombrePropietario: "",
    rfc: "",
    telefonoPropietario: "",
  }
};

function reducer(state, action) {
  switch (action.type) {
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
      return { ...state, errors: { ...state.errors, [action.payload]: undefined } };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

const DepositRegistrationForm = ({ isOpen, onClose, onSuccess }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentStep, direction, loading, error, errors, formData } = state;

  const steps = [
    { id: 1, name: "Información del Depósito", icon: Building2 },
    { id: 2, name: "Datos del Propietario", icon: User },
  ];

  const municipios = [
    "Huamantla",
    "Terrenate",
    "Tlaxcala",
    "Apizaco",
    "Chiautempan",
    "Contla de Juan Cuamatzi",
    "Papalotla de Xicohténcatl",
    "San Pablo del Monte",
    "Zacatelco",
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.nombreDeposito.trim())
        newErrors.nombreDeposito = "El nombre es requerido";
      if (!formData.municipio) newErrors.municipio = "Seleccione un municipio";
      if (!formData.direccion.trim())
        newErrors.direccion = "La dirección es requerida";
      if (!formData.capacidad || formData.capacidad <= 0)
        newErrors.capacidad = "Debe ser mayor a 0";
      if (!formData.telefono.trim())
        newErrors.telefono = "El teléfono es requerido";
    }

    if (step === 2) {
      if (!formData.nombrePropietario.trim())
        newErrors.nombrePropietario = "El nombre es requerido";
      if (!formData.rfc.trim()) newErrors.rfc = "El RFC es requerido";
      if (!formData.telefonoPropietario.trim())
        newErrors.telefonoPropietario = "El teléfono es requerido";
    }

    dispatch({ type: 'SET_ERRORS', payload: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      dispatch({ type: 'SET_STEP', payload: { step: Math.min(currentStep + 1, steps.length), direction: "right" } });
    }
  };

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', payload: { step: Math.max(currentStep - 1, 1), direction: "left" } });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (name === "rfc") {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    }

    dispatch({ type: 'UPDATE_FORM', payload: { [name]: type === "checkbox" ? checked : processedValue } });

    if (errors[name]) {
      dispatch({ type: 'CLEAR_FIELD_ERROR', payload: name });
    }
  };

  const resetForm = () => {
    dispatch({ type: 'RESET' });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateStep(2)) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: "" });

    try {
      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");

      if (!token) {
        throw new Error("Sesión expirada. Inicie sesión nuevamente.");
      }

      const response = await fetch(`${API_URL}/api/depositos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: formData.nombreDeposito,
          municipio: formData.municipio,
          direccion: formData.direccion,
          capacidad: parseInt(formData.capacidad),
          telefono: formData.telefono,
          nombrePropietario: formData.nombrePropietario,
          rfc: formData.rfc,
          telefonoPropietario: formData.telefonoPropietario,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar el depósito");
      }

      resetForm();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden">
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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col mx-2 sm:mx-0 z-10">
        {/* Header Style from Vehicle Form */}
        <div className="sticky top-0 bg-white z-10 px-4 sm:px-6 md:px-8 pt-4 pb-3 md:pt-6 md:pb-4 border-b border-gray-100">
          <ModalHeader 
            onClose={handleClose} 
            title="Registro de Depósito" 
          />
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Global Error */}
        <Toast 
          show={!!error}
          message={error}
          type="error"
          onClose={() => dispatch({ type: 'SET_ERROR', payload: "" })}
        />

        {/* Form Content */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-250px)]">
          <div
            key={currentStep}
            className={`${
              direction === "right"
                ? "animate-slide-right"
                : "animate-slide-left"
            }`}
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-(--color-primary) mb-4">
                  Paso 1: Información del Depósito
                </h3>

                <FormInput
                  label="Nombre del Depósito *"
                  name="nombreDeposito"
                  value={formData.nombreDeposito}
                  onChange={handleChange}
                  error={errors.nombreDeposito}
                  placeholder="Ej: Depósito Vehicular Centro"
                  helperText="Nombre oficial de la concesión o establecimiento"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <FormSelect
                    label="Municipio *"
                    name="municipio"
                    value={formData.municipio}
                    onChange={handleChange}
                    error={errors.municipio}
                    options={municipios}
                  />
                  <FormInput
                    label="Capacidad (vehículos) *"
                    name="capacidad"
                    type="number"
                    value={formData.capacidad}
                    onChange={handleChange}
                    error={errors.capacidad}
                    min="1"
                    placeholder="50"
                  />
                </div>

                <FormInput
                  label="Dirección Completa *"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  error={errors.direccion}
                  placeholder="Calle, número, colonia, código postal"
                />

                <FormInput
                  label="Teléfono de Contacto *"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  error={errors.telefono}
                  placeholder="246 123 4567"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-(--color-primary) mb-4">
                  Paso 2: Datos del Propietario
                </h3>

                <FormInput
                  label="Nombre Completo del Propietario *"
                  name="nombrePropietario"
                  value={formData.nombrePropietario}
                  onChange={handleChange}
                  error={errors.nombrePropietario}
                  placeholder="Nombre(s) y Apellidos"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <FormInput
                    label="RFC *"
                    name="rfc"
                    value={formData.rfc}
                    onChange={handleChange}
                    error={errors.rfc}
                    placeholder="ABCD123456XYZ"
                    maxLength={13}
                  />
                  <FormInput
                    label="Teléfono *"
                    name="telefonoPropietario"
                    type="tel"
                    value={formData.telefonoPropietario}
                    onChange={handleChange}
                    error={errors.telefonoPropietario}
                    placeholder="246 123 4567"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation from Vehicle Form */}
        <NavigationFooter 
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={prevStep}
          onNext={nextStep}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Registrar Depósito"
        />
          </m.div>
        </div>
      )}
    </AnimatePresence>
    </LazyMotion>,
    document.getElementById("modal-root"),
  );
};

export default DepositRegistrationForm;
