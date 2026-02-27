import { useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Building2,
  User,
  UserPlus,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Phone,
  Hash,
  MapPin,
} from "lucide-react";

// Reuse components from VehicleRegistrationForm for consistency
import FormInput from "./VehicleRegistrationForm/components/FormFields/FormInput";
import FormSelect from "./VehicleRegistrationForm/components/FormFields/FormSelect";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const DepositRegistrationForm = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState("right");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    nombreDeposito: "",
    municipio: "",
    direccion: "",
    capacidad: "",
    telefono: "",
    nombrePropietario: "",
    rfc: "",
    telefonoPropietario: "",
    crearCuenta: false,
    email: "",
    password: "",
    confirmPassword: "",
  });

  const steps = [
    { id: 1, name: "Información del Depósito", icon: Building2 },
    { id: 2, name: "Datos del Propietario", icon: User },
    { id: 3, name: "Cuenta de Usuario", icon: UserPlus },
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

    if (step === 3 && formData.crearCuenta) {
      if (!formData.email.trim()) {
        newErrors.email = "El email es requerido";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email inválido";
      }

      if (!formData.password) {
        newErrors.password = "La contraseña es requerida";
      } else if (formData.password.length < 6) {
        newErrors.password = "Mínimo 6 caracteres";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setDirection("right");
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setDirection("left");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (name === "rfc") {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : processedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      nombreDeposito: "",
      municipio: "",
      direccion: "",
      capacidad: "",
      telefono: "",
      nombrePropietario: "",
      rfc: "",
      telefonoPropietario: "",
      crearCuenta: false,
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setError("");
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateStep(3)) return;

    setLoading(true);
    setError("");

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
          crearCuenta: formData.crearCuenta,
          email: formData.crearCuenta ? formData.email : null,
          password: formData.crearCuenta ? formData.password : null,
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slide-up-fade flex flex-col">
        {/* Header Style from Vehicle Form */}
        <div className="sticky top-0 bg-white z-10 px-8 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-(--color-primary)">
                Registro de Depósito
              </h2>
              <p className="text-sm text-gray-500">
                Sistema de Control de Inventarios SMT
              </p>
              <div className="w-16 h-1 bg-(--color-rosa) rounded-full mt-2"></div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Stepper from Vehicle Form */}
          <div className="flex justify-between px-2 sm:px-6 relative">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className="relative flex-1 flex flex-col items-center"
                >
                  {/* Line connecting to next step */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-4 sm:top-5 left-[calc(50%+1rem)] sm:left-[calc(50%+1.25rem)] right-[-50%] h-0.5 sm:h-1 -translate-y-1/2 rounded transition-all duration-300 ${
                        isCompleted ? "bg-(--color-primary)" : "bg-gray-200"
                      }`}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className={`
                      relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-(--color-primary) text-white"
                          : isActive
                          ? "bg-(--color-primary) text-white ring-4 ring-violet-100"
                          : "bg-gray-100 text-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check size={16} className="sm:w-5 sm:h-5" />
                    ) : (
                      <span className="text-sm sm:text-base">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`hidden sm:block text-[10px] sm:text-xs mt-2 text-center w-full px-1 leading-tight ${
                      isActive
                        ? "text-(--color-primary) font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              );
            })}
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
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-250px)]">
          <div
            key={currentStep}
            className={`${
              direction === "right" ? "animate-slide-right" : "animate-slide-left"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-(--color-primary) mb-4">
                  Paso 3: Cuenta de Usuario
                </h3>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Configurar Acceso</h4>
                      <p className="text-sm text-gray-500">
                        Permite que el propietario acceda al sistema
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="crearCuenta"
                        checked={formData.crearCuenta}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--color-primary)"></div>
                    </label>
                  </div>

                  {formData.crearCuenta && (
                    <div className="space-y-4 pt-4 border-t border-gray-200 animate-fade-in">
                      <FormInput
                        label="Correo Electrónico *"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="usuario@ejemplo.com"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label="Contraseña *"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          error={errors.password}
                          placeholder="••••••••"
                        />
                        <FormInput
                          label="Confirmar Contraseña *"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          error={errors.confirmPassword}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation from Vehicle Form */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-4 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
              currentStep === 1 || loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ChevronLeft size={18} />
            Anterior
          </button>

          <span className="text-sm text-gray-500">
            Paso {currentStep} de {steps.length}
          </span>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="px-6 py-2.5 bg-(--color-primary) hover:bg-violet-900 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              Siguiente
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Registrar Depósito
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default DepositRegistrationForm;
