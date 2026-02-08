import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useVehicleForm = (onClose, onSuccess) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState('right');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  
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

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    
    // Prevención de Errores: Filtrado de Datos
    if (['vin', 'placa', 'noInventario', 'folioProceso', 'noOficio', 'noMotor'].includes(name)) {
      value = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    }

    if (name === 'vin' && value.length > 17) return;

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
    errors,
    formData,
    setFormData,
    handleChange,
    handleNumericKeyDown,
    nextStep,
    prevStep,
    handleSubmit,
    getInputClass
  };
};
