import { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

// Campos que requieren validación de duplicados
const DUPLICATE_CHECK_FIELDS = ['folioProceso', 'vin', 'placa', 'noMotor', 'noInventario'];

// Mensajes de error para cada campo
const DUPLICATE_MESSAGES = {
  folioProceso: 'Ya existe un vehículo con este folio de proceso',
  vin: 'Ya existe un vehículo con este VIN',
  placa: 'Ya existe un vehículo con estas placas',
  noMotor: 'Ya existe un vehículo con este número de motor',
  noInventario: 'Ya existe un vehículo con este número de inventario'
};

export const useVehicleForm = (onClose, onSuccess, initialData = null) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState('right');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [duplicateFields, setDuplicateFields] = useState({});
  const [validatingFields, setValidatingFields] = useState({});

  // Refs para debounce
  const debounceRefs = useRef({});

  const [formData, setFormData] = useState({
    // Paso 1: Datos Administrativos
    folioProceso: '',
    fechaIngreso: '',
    autoridad: '',
    depositoId: '',
    documentosAdjuntos: [],
    fotos: [],

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
    obsCristales: '',
    estadoEspejos: '',
    obsEspejos: '',

    // Llantas
    cantLlantasDelanteras: '2',
    estadoLlantasDelanteras: '',
    cantLlantasTraseras: '2',
    estadoLlantasTraseras: '',

    // Mecánica
    estadoMotor: '',
    estadoBateria: '',
    tipoTransmision: '',
    estadoFrenos: '',
    aireAcondicionadoFunciona: false,

    // Interior
    estadoAsientos: '',
    obsAsientos: '',
    estadoCinturones: '',
    obsCinturones: '',
    estadoVolanteTablero: '',
    obsVolanteTablero: '',
    estadoBolsasAire: '',
    obsBolsasAire: '',

    // Ambiental
    estatusAceite: '',
    cantAceite: '',
    estatusAnticongelante: '',
    cantAnticongelante: '',
    estatusCombustible: '',
    cantCombustible: '',

    // Inventario
    objetosPersonales: [],
    observacionesInspector: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        fechaIngreso: initialData.fechaIngreso ? new Date(initialData.fechaIngreso).toISOString().split('T')[0] : '',
        fechaActaBaja: initialData.fechaActaBaja ? new Date(initialData.fechaActaBaja).toISOString().split('T')[0] : '',
        // Ensure some fields that may be null are set to empty string
        noOficio: initialData.noOficio || '',
        estadoCarroceria: initialData.estadoCarroceria || '',
        estadoCristales: initialData.estadoCristales || '',
        estadoEspejos: initialData.estadoEspejos || '',
        estadoLlantasDelanteras: initialData.estadoLlantasDelanteras || '',
        estadoLlantasTraseras: initialData.estadoLlantasTraseras || '',
        tipoTransmision: initialData.tipoTransmision || '',
        estadoAsientos: initialData.estadoAsientos || '',
        estadoCinturones: initialData.estadoCinturones || '',
        estadoVolanteTablero: initialData.estadoVolanteTablero || '',
        estadoFrenos: initialData.estadoFrenos || '',
        estadoBolsasAire: initialData.estadoBolsasAire || '',
        estatusAceite: initialData.estatusAceite || '',
        cantAceite: initialData.cantAceite || '',
        estatusAnticongelante: initialData.estatusAnticongelante || '',
        cantAnticongelante: initialData.cantAnticongelante || '',
        estatusCombustible: initialData.estatusCombustible || '',
        cantCombustible: initialData.cantCombustible || '',
        observacionesInspector: initialData.observacionesInspector || '',
        cantLlantasDelanteras: initialData.cantLlantasDelanteras || '2',
        cantLlantasTraseras: initialData.cantLlantasTraseras || '2',
      }));
    }
  }, [initialData]);

  // Función para validar duplicados en un campo específico
  const validateFieldDuplicate = useCallback(async (fieldName, fieldValue) => {
    if (!fieldValue || fieldValue.trim() === '') {
      setDuplicateFields(prev => ({ ...prev, [fieldName]: false }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      return;
    }

    // Marcar campo como validando
    setValidatingFields(prev => ({ ...prev, [fieldName]: true }));

    // Limpiar validación anterior
    setDuplicateFields(prev => ({ ...prev, [fieldName]: false }));

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      
      const validateData = {
        folioProceso: fieldName === 'folioProceso' ? fieldValue : undefined,
        vin: fieldName === 'vin' ? fieldValue : undefined,
        placa: fieldName === 'placa' ? fieldValue : undefined,
        noMotor: fieldName === 'noMotor' ? fieldValue : undefined,
        noInventario: fieldName === 'noInventario' ? fieldValue : undefined,
        excludeId: initialData?.id || undefined
      };

      const response = await fetch(`${API_URL}/api/vehiculos/validar-duplicados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(validateData)
      });

      const result = await response.json();

      if (result.success && result.hasDuplicate && result.duplicates[fieldName]) {
        setDuplicateFields(prev => ({ ...prev, [fieldName]: true }));
        setErrors(prev => ({
          ...prev,
          [fieldName]: DUPLICATE_MESSAGES[fieldName]
        }));
      } else {
        setDuplicateFields(prev => ({ ...prev, [fieldName]: false }));
        setErrors(prev => {
          const newErrors = { ...prev };
          if (newErrors[fieldName] === DUPLICATE_MESSAGES[fieldName]) {
            delete newErrors[fieldName];
          }
          return newErrors;
        });
      }
    } catch (err) {
      console.error('Error al validar duplicado:', err);
    } finally {
      setValidatingFields(prev => ({ ...prev, [fieldName]: false }));
    }
  }, [initialData]);

  // Validation rules per step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.folioProceso.trim()) newErrors.folioProceso = 'El folio es requerido';
      else if (duplicateFields.folioProceso) newErrors.folioProceso = DUPLICATE_MESSAGES.folioProceso;
      
      if (!formData.fechaIngreso) newErrors.fechaIngreso = 'La fecha es requerida';
      if (!formData.autoridad.trim()) newErrors.autoridad = 'La autoridad es requerida';

      const user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || '{}');
      if ((user.rol === 'SUPER_USUARIO' || user.rol === 'ADMINISTRADOR') && !formData.depositoId) {
        newErrors.depositoId = 'Debe seleccionar un concesionario';
      }
    }

    if (step === 2) {
      if (!formData.noInventario.trim()) {
        newErrors.noInventario = 'El número de inventario es requerido';
      } else if (duplicateFields.noInventario) {
        newErrors.noInventario = DUPLICATE_MESSAGES.noInventario;
      }
      
      if (!formData.marcaTipo.trim()) newErrors.marcaTipo = 'La marca/tipo es requerido';
      if (!formData.anio) newErrors.anio = 'El año es requerido';
      if (formData.anio && (formData.anio < 1900 || formData.anio > 2030)) newErrors.anio = 'Año inválido';
      if (!formData.tipoServicio) newErrors.tipoServicio = 'Seleccione tipo de servicio';
      
      if (!formData.vin.trim()) {
        newErrors.vin = 'El VIN es requerido';
      } else if (duplicateFields.vin) {
        newErrors.vin = DUPLICATE_MESSAGES.vin;
      }
      
      if (!formData.placa.trim()) {
        newErrors.placa = 'Las placas son requeridas';
      } else if (duplicateFields.placa) {
        newErrors.placa = DUPLICATE_MESSAGES.placa;
      }
      
      if (!formData.noMotor.trim()) {
        newErrors.noMotor = 'El número de motor es requerido';
      } else if (duplicateFields.noMotor) {
        newErrors.noMotor = DUPLICATE_MESSAGES.noMotor;
      }
      
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

    if (step === 4) {
      if (!formData.estadoCarroceria) newErrors.estadoCarroceria = 'Seleccione estado de carrocería';
      if (!formData.estadoCristales) newErrors.estadoCristales = 'Seleccione estado de cristales';
      if (!formData.estadoEspejos) newErrors.estadoEspejos = 'Seleccione estado de espejos';
      if (!formData.estadoLlantasDelanteras) newErrors.estadoLlantasDelanteras = 'Seleccione estado llantas delanteras';
      if (!formData.estadoLlantasTraseras) newErrors.estadoLlantasTraseras = 'Seleccione estado llantas traseras';

      // Conditional observations validation
      if ((formData.estadoCristales === 'DAÑADOS' || formData.estadoCristales === 'INCOMPLETOS') && !formData.obsCristales?.trim()) {
        newErrors.obsCristales = 'Especifique el daño en cristales';
      }
      if (formData.estadoEspejos === 'INCOMPLETOS' && !formData.obsEspejos?.trim()) {
        newErrors.obsEspejos = 'Especifique el estado de espejos';
      }

      // Ambiental validation
      if (!formData.estatusAceite) newErrors.estatusAceite = 'Seleccione estatus de aceite';
      if (!formData.estatusAnticongelante) newErrors.estatusAnticongelante = 'Seleccione estatus de anticongelante';
      if (!formData.estatusCombustible) newErrors.estatusCombustible = 'Seleccione estatus de combustible';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNumericKeyDown = (e) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const scrollToFirstError = (errorsObj) => {
    const firstErrorKey = Object.keys(errorsObj)[0];
    if (firstErrorKey) {
      setTimeout(() => {
        const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
      }, 100); // Small timeout to ensure DOM updates
    }
  };


  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    // Prevención de Errores: Filtrado de Datos
    if (['vin', 'placa', 'noInventario', 'folioProceso', 'noOficio', 'noMotor'].includes(name)) {
      value = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    }

    if (name === 'vin' && value.length > 17) return;

    if ((name === 'cantLlantasDelanteras' || name === 'cantLlantasTraseras')) {
      // Prevención de errores en llantas: max 2
      if (value !== '' && (isNaN(parseInt(value)) || parseInt(value) < 0 || parseInt(value) > 2)) {
         return;
      }
    }

    // Lógica para Ambiental: Desactivar/Limpiar cantidad si está DRENADO
    if (name === 'estatusAceite') {
      setFormData(prev => ({
        ...prev,
        estatusAceite: value,
        cantAceite: value === 'DRENADO' ? '0% (DRENADO)' : ''
      }));
      return;
    }
    if (name === 'estatusAnticongelante') {
      setFormData(prev => ({
        ...prev,
        estatusAnticongelante: value,
        cantAnticongelante: value === 'DRENADO' ? '0% (DRENADO)' : ''
      }));
      return;
    }
    if (name === 'estatusCombustible') {
      setFormData(prev => ({
        ...prev,
        estatusCombustible: value,
        cantCombustible: value === 'DRENADO' ? '0% (DRENADO)' : ''
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error al modificar campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Validar duplicados con debounce para campos importantes
    if (DUPLICATE_CHECK_FIELDS.includes(name)) {
      // Limpiar debounce anterior si existe
      if (debounceRefs.current[name]) {
        clearTimeout(debounceRefs.current[name]);
      }

      // Si el campo está vacío, limpiar validación inmediatamente
      if (!value || value.trim() === '') {
        setDuplicateFields(prev => ({ ...prev, [name]: false }));
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        return;
      }

      // Nuevo debounce de 500ms
      debounceRefs.current[name] = setTimeout(() => {
        validateFieldDuplicate(name, value);
      }, 500);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setDirection('right');
        setCurrentStep(prev => prev + 1);
      }
    } else {
      // Scroll to error if validation fails on Next Step
      scrollToFirstError(errors);
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
      folioProceso: '', fechaIngreso: '', autoridad: '', depositoId: '', documentosAdjuntos: [], fotos: [],
      noInventario: '', marcaTipo: '', anio: '', tipoServicio: '', vin: '', placa: '',
      noMotor: '', colorOriginal: '', colorActual: '', odometro: '',
      estatusLegal: '', tieneActaBaja: false, noOficio: '', fechaActaBaja: '', tieneTituloFactura: false,
      estadoCarroceria: '', estadoCristales: '', obsCristales: '', estadoEspejos: '', obsEspejos: '',
      cantLlantasDelanteras: '2', estadoLlantasDelanteras: '', cantLlantasTraseras: '2', estadoLlantasTraseras: '',
      estadoMotor: '', estadoBateria: '', tipoTransmision: '', estadoFrenos: '', aireAcondicionadoFunciona: false,
      estadoAsientos: '', obsAsientos: '', estadoCinturones: '', obsCinturones: '',
      estadoVolanteTablero: '', obsVolanteTablero: '', estadoBolsasAire: '', obsBolsasAire: '',
      estatusAceite: '', cantAceite: '', estatusAnticongelante: '', cantAnticongelante: '',
      estatusCombustible: '', cantCombustible: '', objetosPersonales: [], observacionesInspector: ''
    });
    setCurrentStep(1);
    setErrors({});
    setError('');
    setDuplicateFields({});
    setValidatingFields({});
    
    // Limpiar todos los debounce
    Object.values(debounceRefs.current).forEach(timeout => clearTimeout(timeout));
    debounceRefs.current = {};
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      scrollToFirstError(errors);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user'));

      if (!token || !user) {
        throw new Error('Sesión expirada. Inicie sesión nuevamente.');
      }

      const isEditMode = !!(initialData && initialData.id);
      const url = isEditMode
        ? `${API_URL}/api/vehiculos/${initialData.id}`
        : `${API_URL}/api/vehiculos`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
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
        throw new Error(data.message || `Error al ${isEditMode ? 'actualizar' : 'registrar'} el vehículo`);
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

  const getInputClass = (fieldName) => {
    const baseClass = "w-full px-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm";
    return errors[fieldName]
      ? `${baseClass} border-red-500 focus:ring-red-500`
      : `${baseClass} border-gray-300`;
  };

  return {
    currentStep,
    direction,
    loading,
    error,
    setError,
    errors,
    formData,
    setFormData,
    handleChange,
    handleNumericKeyDown,
    nextStep,
    prevStep,
    handleSubmit,
    getInputClass,
    duplicateFields,
    validatingFields
  };
};
