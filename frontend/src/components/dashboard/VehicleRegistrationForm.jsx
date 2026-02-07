import { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Upload, 
  FileText,
  Car,
  Shield,
  ClipboardCheck,
  AlertCircle,
  Loader2,
  // Icons for Step 4 sections
  Truck,
  Cog,
  Armchair,
  Wrench,
  AlertTriangle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const VehicleRegistrationForm = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState('right');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    // Paso 1: Datos Administrativos
    folioProceso: '',
    fechaIngreso: '',
    autoridad: '',
    documentosAdjuntos: [],

    // Paso 2: Datos del Vehículo
    noInventario: '',
    marcaTipo: '',
    anio: '',
    tipoServicio: '',
    vin: '',
    placa: '',
    noMotor: '',
    colorOriginal: '',
    colorActual: '',
    odometro: '',

    // Paso 3: Estatus Legal
    estatusLegal: '',
    tieneActaBaja: false,
    noOficio: '',
    fechaActaBaja: '',
    tieneTituloFactura: false,

    // Paso 4: Inspección Física
    estadoCarroceria: '',
    estadoCristales: '',
    estadoEspejos: '',
    estadoLlantasDelanteras: '',
    estadoLlantasTraseras: '',
    motorCompleto: false,
    bateriaPresente: false,
    tipoTransmision: '',
    estadoAsientos: '',
    estadoCinturones: '',
    estadoVolanteTablero: '',
    estadoFrenos: '',
    aireAcondicionadoFunciona: false,
    liquidosDrenados: false,
    estadoBolsasAire: '',
    observacionesInspector: ''
  });

  const steps = [
    { id: 1, name: 'Datos Administrativos', icon: FileText },
    { id: 2, name: 'Datos del Vehículo', icon: Car },
    { id: 3, name: 'Estatus Legal', icon: Shield },
    { id: 4, name: 'Inspección Física', icon: ClipboardCheck }
  ];

  // Validation rules per step
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.folioProceso.trim()) newErrors.folioProceso = 'El folio es requerido';
      if (!formData.fechaIngreso) newErrors.fechaIngreso = 'La fecha es requerida';
      if (!formData.autoridad.trim()) newErrors.autoridad = 'La autoridad es requerida';
    }
    
    if (step === 2) {
      if (!formData.noInventario.trim()) newErrors.noInventario = 'El número de inventario es requerido';
      if (!formData.marcaTipo.trim()) newErrors.marcaTipo = 'La marca/tipo es requerido';
      if (!formData.anio) newErrors.anio = 'El año es requerido';
      if (formData.anio && (formData.anio < 1900 || formData.anio > 2030)) newErrors.anio = 'Año inválido';
      if (!formData.tipoServicio) newErrors.tipoServicio = 'Seleccione tipo de servicio';
      if (!formData.vin.trim()) newErrors.vin = 'El VIN es requerido';
      if (formData.vin && formData.vin.length !== 17) newErrors.vin = 'El VIN debe tener 17 caracteres';
      if (!formData.placa.trim()) newErrors.placa = 'Las placas son requeridas';
      if (!formData.noMotor.trim()) newErrors.noMotor = 'El número de motor es requerido';
      if (!formData.colorOriginal.trim()) newErrors.colorOriginal = 'El color original es requerido';
      if (!formData.colorActual.trim()) newErrors.colorActual = 'El color actual es requerido';
      if (!formData.odometro) newErrors.odometro = 'El odómetro es requerido';
    }
    
    if (step === 3) {
      if (!formData.estatusLegal) newErrors.estatusLegal = 'Seleccione estatus legal';
      if (formData.tieneActaBaja) {
        if (!formData.noOficio.trim()) newErrors.noOficio = 'El número de oficio es requerido';
        if (!formData.fechaActaBaja) newErrors.fechaActaBaja = 'La fecha del acta es requerida';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setDirection('right');
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection('left');
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetForm = () => {
    setFormData({
      folioProceso: '', fechaIngreso: '', autoridad: '', documentosAdjuntos: [],
      noInventario: '', marcaTipo: '', anio: '', tipoServicio: '', vin: '', placa: '',
      noMotor: '', colorOriginal: '', colorActual: '', odometro: '',
      estatusLegal: '', tieneActaBaja: false, noOficio: '', fechaActaBaja: '', tieneTituloFactura: false,
      estadoCarroceria: '', estadoCristales: '', estadoEspejos: '', estadoLlantasDelanteras: '',
      estadoLlantasTraseras: '', motorCompleto: false, bateriaPresente: false, tipoTransmision: '',
      estadoAsientos: '', estadoCinturones: '', estadoVolanteTablero: '', estadoFrenos: '',
      aireAcondicionadoFunciona: false, liquidosDrenados: false, estadoBolsasAire: '', observacionesInspector: ''
    });
    setCurrentStep(1);
    setErrors({});
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user'));
      
      if (!token || !user) {
        throw new Error('Sesión expirada. Inicie sesión nuevamente.');
      }

      const response = await fetch(`${API_URL}/api/vehiculos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          anio: parseInt(formData.anio),
          odometro: parseInt(formData.odometro),
          fechaIngreso: new Date(formData.fechaIngreso).toISOString(),
          fechaActaBaja: formData.fechaActaBaja ? new Date(formData.fechaActaBaja).toISOString() : null,
          registradoPorId: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el vehículo');
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

  // Helper styles
  const getInputClass = (fieldName) => {
    const baseClass = "w-full px-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm";
    return errors[fieldName] 
      ? `${baseClass} border-red-500 focus:ring-red-500` 
      : `${baseClass} border-gray-300`;
  };
  
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const checkboxClass = "h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]";
  const errorTextClass = "text-xs text-red-500 mt-1";

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-8 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-(--color-primary)">Registro de Ingreso Vehicular</h2>
              <p className="text-sm text-gray-500">Sistema de Control de Inventarios SMT</p>
              <div className="w-16 h-1 bg-(--color-rosa) rounded-full mt-2"></div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between px-2 sm:px-6">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center" style={{ flex: index < steps.length - 1 ? '1 0 auto' : '0 0 auto' }}>
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${isCompleted ? 'bg-(--color-primary) text-white' : 
                        isActive ? 'bg-(--color-primary) text-white ring-4 ring-violet-100' : 
                        'bg-gray-100 text-gray-400'}
                    `}>
                      {isCompleted ? <Check size={16} className="sm:w-5 sm:h-5" /> : <span className="text-sm sm:text-base">{step.id}</span>}
                    </div>
                    {/* Hide labels on mobile as they are redundant with the step title below */}
                    <span className={`hidden sm:block text-[10px] sm:text-xs mt-2 text-center w-full max-w-20 leading-tight ${isActive ? 'text-(--color-primary) font-medium' : 'text-gray-500'}`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4 rounded transition-all duration-300 min-w-2.5 ${
                      isCompleted ? 'bg-(--color-primary)' : 'bg-gray-200'
                    }`} />
                  )}
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
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)]">
          <div 
            key={currentStep}
            className={`${direction === 'right' ? 'animate-slide-right' : 'animate-slide-left'}`}
          >
            {/* PASO 1: Datos Administrativos */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-(--color-primary) mb-4">
                  Paso 1: Datos Administrativos
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Folio de Proceso *</label>
                    <input
                      type="text"
                      name="folioProceso"
                      value={formData.folioProceso}
                      onChange={handleChange}
                      placeholder="Ej. SMT-2026-001234"
                      className={getInputClass('folioProceso')}
                    />
                    {errors.folioProceso && <p className={errorTextClass}>{errors.folioProceso}</p>}
                    <p className="text-xs text-gray-400 mt-1">Folio único de identificación del proceso</p>
                  </div>
                  <div>
                    <label className={labelClass}>Fecha de Ingreso *</label>
                    <input
                      type="date"
                      name="fechaIngreso"
                      value={formData.fechaIngreso}
                      onChange={handleChange}
                      className={getInputClass('fechaIngreso')}
                    />
                    {errors.fechaIngreso && <p className={errorTextClass}>{errors.fechaIngreso}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Autoridad Responsable *</label>
                  <input
                    type="text"
                    name="autoridad"
                    value={formData.autoridad}
                    onChange={handleChange}
                    placeholder="Ej. Fiscalía General del Estado de Tlaxcala"
                    className={getInputClass('autoridad')}
                  />
                  {errors.autoridad && <p className={errorTextClass}>{errors.autoridad}</p>}
                </div>

                <div>
                  <label className={labelClass}>Documentos Adjuntos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-(--color-primary) transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600">Haz clic para cargar archivos o arrástralos aquí</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOC (máx. 10MB cada uno)</p>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2: Datos del Vehículo */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-(--color-primary) mb-4">
                  Paso 2: Datos del Vehículo
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>No. Inventario *</label>
                    <input
                      type="text"
                      name="noInventario"
                      value={formData.noInventario}
                      onChange={handleChange}
                      placeholder="Ej. INV-2026-0001"
                      className={getInputClass('noInventario')}
                    />
                    {errors.noInventario && <p className={errorTextClass}>{errors.noInventario}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Marca/Tipo *</label>
                    <input
                      type="text"
                      name="marcaTipo"
                      value={formData.marcaTipo}
                      onChange={handleChange}
                      placeholder="Ej. Toyota Corolla"
                      className={getInputClass('marcaTipo')}
                    />
                    {errors.marcaTipo && <p className={errorTextClass}>{errors.marcaTipo}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Año *</label>
                    <input
                      type="number"
                      name="anio"
                      value={formData.anio}
                      onChange={handleChange}
                      placeholder="Ej. 2020"
                      min="1900"
                      max="2030"
                      className={getInputClass('anio')}
                    />
                    {errors.anio && <p className={errorTextClass}>{errors.anio}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Tipo de Servicio *</label>
                    <select
                      name="tipoServicio"
                      value={formData.tipoServicio}
                      onChange={handleChange}
                      className={getInputClass('tipoServicio')}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="PARTICULAR">Particular</option>
                      <option value="PUBLICO">Público</option>
                    </select>
                    {errors.tipoServicio && <p className={errorTextClass}>{errors.tipoServicio}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>VIN (Número de Identificación Vehicular) *</label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    placeholder="17 caracteres alfanuméricos"
                    maxLength={17}
                    className={getInputClass('vin')}
                  />
                  {errors.vin && <p className={errorTextClass}>{errors.vin}</p>}
                  <p className="text-xs text-gray-400 mt-1">{formData.vin.length}/17 caracteres</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Placas *</label>
                    <input
                      type="text"
                      name="placa"
                      value={formData.placa}
                      onChange={handleChange}
                      placeholder="Ej. ABC-123-D"
                      className={getInputClass('placa')}
                    />
                    {errors.placa && <p className={errorTextClass}>{errors.placa}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>No. Motor *</label>
                    <input
                      type="text"
                      name="noMotor"
                      value={formData.noMotor}
                      onChange={handleChange}
                      placeholder="Número de motor"
                      className={getInputClass('noMotor')}
                    />
                    {errors.noMotor && <p className={errorTextClass}>{errors.noMotor}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Color Original *</label>
                    <input
                      type="text"
                      name="colorOriginal"
                      value={formData.colorOriginal}
                      onChange={handleChange}
                      placeholder="Ej. Blanco"
                      className={getInputClass('colorOriginal')}
                    />
                    {errors.colorOriginal && <p className={errorTextClass}>{errors.colorOriginal}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Color Actual *</label>
                    <input
                      type="text"
                      name="colorActual"
                      value={formData.colorActual}
                      onChange={handleChange}
                      placeholder="Ej. Blanco"
                      className={getInputClass('colorActual')}
                    />
                    {errors.colorActual && <p className={errorTextClass}>{errors.colorActual}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Odómetro (km) *</label>
                  <input
                    type="number"
                    name="odometro"
                    value={formData.odometro}
                    onChange={handleChange}
                    placeholder="Ej. 85000"
                    min="0"
                    className={getInputClass('odometro')}
                  />
                  {errors.odometro && <p className={errorTextClass}>{errors.odometro}</p>}
                </div>
              </div>
            )}

            {/* PASO 3: Estatus Legal */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-(--color-primary) mb-4">
                  Paso 3: Estatus Legal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Estatus Legal *</label>
                    <select
                      name="estatusLegal"
                      value={formData.estatusLegal}
                      onChange={handleChange}
                      className={getInputClass('estatusLegal')}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="ROBADO">Robado</option>
                      <option value="DECOMISADO">Decomisado</option>
                      <option value="OBSOLETO">Obsoleto</option>
                      <option value="SINIESTRADO">Siniestrado</option>
                    </select>
                    {errors.estatusLegal && <p className={errorTextClass}>{errors.estatusLegal}</p>}
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      name="tieneActaBaja"
                      id="tieneActaBaja"
                      checked={formData.tieneActaBaja}
                      onChange={handleChange}
                      className={checkboxClass}
                    />
                    <label htmlFor="tieneActaBaja" className="ml-2 text-sm font-medium text-gray-700">
                      Tiene Acta de Baja
                    </label>
                  </div>
                </div>

                {formData.tieneActaBaja && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg animate-fade-in">
                    <div>
                      <label className={labelClass}>Número de Oficio *</label>
                      <input
                        type="text"
                        name="noOficio"
                        value={formData.noOficio}
                        onChange={handleChange}
                        placeholder="Ej. OF-2026-0001"
                        className={getInputClass('noOficio')}
                      />
                      {errors.noOficio && <p className={errorTextClass}>{errors.noOficio}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Fecha de Acta de Baja *</label>
                      <input
                        type="date"
                        name="fechaActaBaja"
                        value={formData.fechaActaBaja}
                        onChange={handleChange}
                        className={getInputClass('fechaActaBaja')}
                      />
                      {errors.fechaActaBaja && <p className={errorTextClass}>{errors.fechaActaBaja}</p>}
                    </div>
                  </div>
                )}

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    name="tieneTituloFactura"
                    id="tieneTituloFactura"
                    checked={formData.tieneTituloFactura}
                    onChange={handleChange}
                    className={checkboxClass}
                  />
                  <label htmlFor="tieneTituloFactura" className="ml-2 text-sm font-medium text-gray-700">
                    Tiene Título/Factura Original
                  </label>
                </div>
              </div>
            )}

            {/* PASO 4: Inspección Física */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-(--color-primary) mb-4">
                  Paso 4: Inspección Física
                </h3>
                
                {/* Carrocería */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Truck size={18} className="text-(--color-primary)" />
                    Carrocería
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Estado General</label>
                      <select name="estadoCarroceria" value={formData.estadoCarroceria} onChange={handleChange} className={getInputClass('estadoCarroceria')}>
                        <option value="">Seleccionar...</option>
                        <option value="BUENO">Bueno</option>
                        <option value="REGULAR">Regular</option>
                        <option value="MALO">Malo</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Cristales</label>
                      <select name="estadoCristales" value={formData.estadoCristales} onChange={handleChange} className={getInputClass('estadoCristales')}>
                        <option value="">Seleccionar...</option>
                        <option value="COMPLETOS">Completos</option>
                        <option value="INCOMPLETOS">Incompletos</option>
                        <option value="DAÑADOS">Dañados</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Espejos</label>
                      <select name="estadoEspejos" value={formData.estadoEspejos} onChange={handleChange} className={getInputClass('estadoEspejos')}>
                        <option value="">Seleccionar...</option>
                        <option value="COMPLETOS">Completos</option>
                        <option value="INCOMPLETOS">Incompletos</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Llantas Delanteras</label>
                      <select name="estadoLlantasDelanteras" value={formData.estadoLlantasDelanteras} onChange={handleChange} className={getInputClass('estadoLlantasDelanteras')}>
                        <option value="">Seleccionar...</option>
                        <option value="BUENAS">Buenas</option>
                        <option value="REGULARES">Regulares</option>
                        <option value="MALAS">Malas</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Llantas Traseras</label>
                      <select name="estadoLlantasTraseras" value={formData.estadoLlantasTraseras} onChange={handleChange} className={getInputClass('estadoLlantasTraseras')}>
                        <option value="">Seleccionar...</option>
                        <option value="BUENAS">Buenas</option>
                        <option value="REGULARES">Regulares</option>
                        <option value="MALAS">Malas</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Mecánica */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Cog size={18} className="text-(--color-primary)" />
                    Mecánica
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <input type="checkbox" name="motorCompleto" id="motorCompleto" checked={formData.motorCompleto} onChange={handleChange} className={checkboxClass} />
                      <label htmlFor="motorCompleto" className="ml-2 text-sm text-gray-700">Motor Completo</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" name="bateriaPresente" id="bateriaPresente" checked={formData.bateriaPresente} onChange={handleChange} className={checkboxClass} />
                      <label htmlFor="bateriaPresente" className="ml-2 text-sm text-gray-700">Batería Presente</label>
                    </div>
                    <div>
                      <label className={labelClass}>Transmisión</label>
                      <select name="tipoTransmision" value={formData.tipoTransmision} onChange={handleChange} className={getInputClass('tipoTransmision')}>
                        <option value="">Seleccionar...</option>
                        <option value="MANUAL">Manual</option>
                        <option value="AUTOMATICA">Automática</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Interior */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Armchair size={18} className="text-(--color-primary)" />
                    Interior
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Asientos</label>
                      <select name="estadoAsientos" value={formData.estadoAsientos} onChange={handleChange} className={getInputClass('estadoAsientos')}>
                        <option value="">Seleccionar...</option>
                        <option value="BUENO">Bueno</option>
                        <option value="REGULAR">Regular</option>
                        <option value="MALO">Malo</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Cinturones</label>
                      <select name="estadoCinturones" value={formData.estadoCinturones} onChange={handleChange} className={getInputClass('estadoCinturones')}>
                        <option value="">Seleccionar...</option>
                        <option value="COMPLETOS">Completos</option>
                        <option value="INCOMPLETOS">Incompletos</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Volante/Tablero</label>
                      <select name="estadoVolanteTablero" value={formData.estadoVolanteTablero} onChange={handleChange} className={getInputClass('estadoVolanteTablero')}>
                        <option value="">Seleccionar...</option>
                        <option value="BUENO">Bueno</option>
                        <option value="REGULAR">Regular</option>
                        <option value="MALO">Malo</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sistemas */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Wrench size={18} className="text-(--color-primary)" />
                    Sistemas
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Frenos</label>
                      <select name="estadoFrenos" value={formData.estadoFrenos} onChange={handleChange} className={getInputClass('estadoFrenos')}>
                        <option value="">Seleccionar...</option>
                        <option value="FUNCIONAL">Funcional</option>
                        <option value="NO_FUNCIONAL">No Funcional</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-6">
                      <input type="checkbox" name="aireAcondicionadoFunciona" id="aireAcondicionadoFunciona" checked={formData.aireAcondicionadoFunciona} onChange={handleChange} className={checkboxClass} />
                      <label htmlFor="aireAcondicionadoFunciona" className="ml-2 text-sm text-gray-700">Aire Acondicionado Funciona</label>
                    </div>
                  </div>
                </div>

                {/* Ambiental (CRÍTICO) */}
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                    <AlertTriangle size={18} />
                    Ambiental (CRÍTICO)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-white rounded-lg border border-red-200">
                      <input type="checkbox" name="liquidosDrenados" id="liquidosDrenados" checked={formData.liquidosDrenados} onChange={handleChange} className="h-5 w-5 rounded border-red-300 text-red-600 focus:ring-red-500" />
                      <label htmlFor="liquidosDrenados" className="ml-3 text-sm font-medium text-red-700">
                        Líquidos Drenados (Aceite/Combustible)
                      </label>
                    </div>
                    <div>
                      <label className={labelClass}>Estado Bolsas de Aire</label>
                      <select name="estadoBolsasAire" value={formData.estadoBolsasAire} onChange={handleChange} className={getInputClass('estadoBolsasAire')}>
                        <option value="">Seleccionar...</option>
                        <option value="PRESENTES">Presentes</option>
                        <option value="DESPLEGADAS">Desplegadas</option>
                        <option value="AUSENTES">Ausentes</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Observaciones */}
                <div>
                  <label className={labelClass}>Observaciones del Inspector</label>
                  <textarea
                    name="observacionesInspector"
                    value={formData.observacionesInspector}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Ingrese cualquier observación adicional sobre el estado del vehículo..."
                    className={`${getInputClass('observacionesInspector')} resize-none`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-4 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
              currentStep === 1 || loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ChevronLeft size={18} />
            Anterior
          </button>

          <span className="text-sm text-gray-500">
            Paso {currentStep} de 4
          </span>

          {currentStep < 4 ? (
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
                  Registrar Vehículo
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default VehicleRegistrationForm;
