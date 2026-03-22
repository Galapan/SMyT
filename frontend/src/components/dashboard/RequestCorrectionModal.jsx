import { useReducer } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Edit3, X, Car, FileText, ClipboardCheck, Shield, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

// Campos organizados por categorías/pasos
const CAMPOS_DISPONIBLES = {
  paso1: [
    { id: 'folioProceso', label: 'Folio de Proceso' },
    { id: 'fechaIngreso', label: 'Fecha de Ingreso' },
    { id: 'autoridad', label: 'Autoridad' },
    { id: 'depositoId', label: 'Depósito/Concesionario' },
    { id: 'fotos', label: 'Fotografías' }
  ],
  paso2: [
    { id: 'noInventario', label: 'Número de Inventario' },
    { id: 'marcaTipo', label: 'Marca/Tipo' },
    { id: 'anio', label: 'Año' },
    { id: 'tipoServicio', label: 'Tipo de Servicio' },
    { id: 'vin', label: 'VIN' },
    { id: 'placa', label: 'Placa' },
    { id: 'noMotor', label: 'Número de Motor' },
    { id: 'colorOriginal', label: 'Color Original' },
    { id: 'colorActual', label: 'Color Actual' },
    { id: 'odometro', label: 'Odómetro' }
  ],
  paso3: [
    { id: 'estatusLegal', label: 'Estatus Legal' },
    { id: 'tieneActaBaja', label: 'Acta de Baja' },
    { id: 'noOficio', label: 'Número de Oficio' },
    { id: 'fechaActaBaja', label: 'Fecha de Acta de Baja' },
    { id: 'tieneTituloFactura', label: 'Título/Factura' }
  ],
  paso4: [
    { id: 'estadoCarroceria', label: 'Estado de Carrocería' },
    { id: 'estadoCristales', label: 'Estado de Cristales' },
    { id: 'obsCristales', label: 'Obs. Cristales' },
    { id: 'estadoEspejos', label: 'Estado de Espejos' },
    { id: 'obsEspejos', label: 'Obs. Espejos' },

    { id: 'cantLlantasDelanteras', label: 'Cant. Llantas Delanteras' },
    { id: 'estadoLlantasDelanteras', label: 'Estado Llantas Delanteras' },
    { id: 'cantLlantasTraseras', label: 'Cant. Llantas Traseras' },
    { id: 'estadoLlantasTraseras', label: 'Estado Llantas Traseras' },

    { id: 'estadoMotor', label: 'Estado del Motor' },
    { id: 'estadoBateria', label: 'Batería' },
    { id: 'tipoTransmision', label: 'Tipo de Transmisión' },
    { id: 'estadoFrenos', label: 'Estado de Frenos' },
    { id: 'aireAcondicionadoFunciona', label: 'Aire Acondicionado' },

    { id: 'estadoAsientos', label: 'Estado de Asientos' },
    { id: 'obsAsientos', label: 'Obs. Asientos' },
    { id: 'estadoCinturones', label: 'Estado de Cinturones' },
    { id: 'obsCinturones', label: 'Obs. Cinturones' },
    { id: 'estadoVolanteTablero', label: 'Estado de Volante/Tablero' },
    { id: 'obsVolanteTablero', label: 'Obs. Volante/Tablero' },
    { id: 'estadoBolsasAire', label: 'Estado de Bolsas de Aire' },
    { id: 'obsBolsasAire', label: 'Obs. Bolsas de Aire' },

    { id: 'estatusAceite', label: 'Estatus de Aceite' },
    { id: 'cantAceite', label: 'Cantidad de Aceite' },
    { id: 'estatusAnticongelante', label: 'Estatus de Anticongelante' },
    { id: 'cantAnticongelante', label: 'Cantidad de Anticongelante' },
    { id: 'estatusCombustible', label: 'Estatus de Combustible' },
    { id: 'cantCombustible', label: 'Cantidad de Combustible' },

    { id: 'objetosPersonales', label: 'Objetos Personales' },
    { id: 'observacionesInspector', label: 'Observaciones Generales' }
  ]
};

const StepHeader = ({ step, icon: Icon, title, expandedStep, toggleStep, camposIncorrectos }) => (
  <button
    onClick={() => toggleStep(step)}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
      expandedStep === step
        ? 'bg-(--color-primary)/10 border border-(--color-primary)/20'
        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={expandedStep === step ? 'text-(--color-primary)' : 'text-gray-500'} />
      <span className={`text-sm font-semibold ${expandedStep === step ? 'text-(--color-primary)' : 'text-gray-700'}`}>
        {title}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">
        {camposIncorrectos.filter(c => CAMPOS_DISPONIBLES[`paso${step}`].map(f => f.id).includes(c)).length} seleccionados
      </span>
      <svg
        className={`w-5 h-5 transition-transform ${expandedStep === step ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </button>
);

const initialState = {
  motivo: '',
  camposIncorrectos: [],
  expandedStep: 1,
  isSubmitting: false,
  errorMsg: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MOTIVO':
      return { ...state, motivo: action.payload };
    case 'TOGGLE_CAMPO':
      return {
        ...state,
        camposIncorrectos: state.camposIncorrectos.includes(action.payload)
          ? state.camposIncorrectos.filter(c => c !== action.payload)
          : [...state.camposIncorrectos, action.payload],
        errorMsg: ''
      };
    case 'SET_EXPANDED_STEP':
      return { ...state, expandedStep: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_ERROR':
      return { ...state, errorMsg: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const RequestCorrectionModal = ({ isOpen, onClose, vehiculo, onSuccess }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { motivo, camposIncorrectos, expandedStep, isSubmitting, errorMsg } = state;

  if (!isOpen || !vehiculo) return null;

  const toggleCampo = (campoId) => {
    dispatch({ type: 'TOGGLE_CAMPO', payload: campoId });
  };

  const toggleStep = (step) => {
    dispatch({ type: 'SET_EXPANDED_STEP', payload: expandedStep === step ? null : step });
  };

  const handleSubmit = async () => {
    if (!motivo.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Debe escribir una justificación para la solicitud.' });
      return;
    }
    if (camposIncorrectos.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Debe seleccionar al menos un campo incorrecto.' });
      return;
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/solicitudes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ vehiculoId: vehiculo.id, motivo, camposIncorrectos })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        dispatch({ type: 'RESET' });
        onSuccess(`Solicitud enviada exitosamente para folio ${vehiculo.folioProceso}`);
        onClose();
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message || 'Error al enviar solicitud' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error de conexión con el servidor. Por favor, intenta de nuevo.' });
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Modal Container */}
          <m.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } }}
            exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 z-10"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-(--color-primary)/5 shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 size={20} className="text-(--color-primary)" />
                <h3 className="text-lg font-bold text-gray-900">Solicitar Corrección de Registro</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3">
                <Car size={20} className="text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Expediente Seleccionado</p>
                  <p className="text-sm text-gray-600"><span className="font-bold">Folio:</span> {vehiculo.folioProceso}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{vehiculo.marcaTipo} (Placa: {vehiculo.placa || 'N/A'})</p>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200 flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  {errorMsg}
                </div>
              )}

              {/* Campos Incorrectos */}
              <div>
                <div role="heading" aria-level="4" className="block text-sm font-semibold text-gray-700 mb-2">
                  Campos Incorrectos <span className="text-(--color-primary)">*</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Seleccione los campos específicos que requieren corrección. Solo estos campos podrán editarse.
                </p>

                <div className="space-y-2">
                  {/* Paso 1 */}
                  <StepHeader step={1} icon={FileText} title="Datos Administrativos" expandedStep={expandedStep} toggleStep={toggleStep} camposIncorrectos={camposIncorrectos} />
                  {expandedStep === 1 && (
                    <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {CAMPOS_DISPONIBLES.paso1.map(campo => (
                        <label
                          key={campo.id}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                            camposIncorrectos.includes(campo.id)
                              ? 'bg-(--color-primary)/10 border border-(--color-primary)/30'
                              : 'bg-white border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={camposIncorrectos.includes(campo.id)}
                            onChange={() => toggleCampo(campo.id)}
                            className="w-4 h-4 text-(--color-primary) rounded border-gray-300 focus:ring-(--color-primary)"
                          />
                          <span className="text-xs text-gray-700">{campo.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Paso 2 */}
                  <StepHeader step={2} icon={Car} title="Datos del Vehículo" expandedStep={expandedStep} toggleStep={toggleStep} camposIncorrectos={camposIncorrectos} />
                  {expandedStep === 2 && (
                    <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {CAMPOS_DISPONIBLES.paso2.map(campo => (
                        <label
                          key={campo.id}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                            camposIncorrectos.includes(campo.id)
                              ? 'bg-(--color-primary)/10 border border-(--color-primary)/30'
                              : 'bg-white border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={camposIncorrectos.includes(campo.id)}
                            onChange={() => toggleCampo(campo.id)}
                            className="w-4 h-4 text-(--color-primary) rounded border-gray-300 focus:ring-(--color-primary)"
                          />
                          <span className="text-xs text-gray-700">{campo.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Paso 3 */}
                  <StepHeader step={3} icon={Shield} title="Estatus Legal" expandedStep={expandedStep} toggleStep={toggleStep} camposIncorrectos={camposIncorrectos} />
                  {expandedStep === 3 && (
                    <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {CAMPOS_DISPONIBLES.paso3.map(campo => (
                        <label
                          key={campo.id}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                            camposIncorrectos.includes(campo.id)
                              ? 'bg-(--color-primary)/10 border border-(--color-primary)/30'
                              : 'bg-white border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={camposIncorrectos.includes(campo.id)}
                            onChange={() => toggleCampo(campo.id)}
                            className="w-4 h-4 text-(--color-primary) rounded border-gray-300 focus:ring-(--color-primary)"
                          />
                          <span className="text-xs text-gray-700">{campo.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Paso 4 */}
                  <StepHeader step={4} icon={ClipboardCheck} title="Inspección Física" expandedStep={expandedStep} toggleStep={toggleStep} camposIncorrectos={camposIncorrectos} />
                  {expandedStep === 4 && (
                    <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                      {CAMPOS_DISPONIBLES.paso4.map(campo => (
                        <label
                          key={campo.id}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                            camposIncorrectos.includes(campo.id)
                              ? 'bg-(--color-primary)/10 border border-(--color-primary)/30'
                              : 'bg-white border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={camposIncorrectos.includes(campo.id)}
                            onChange={() => toggleCampo(campo.id)}
                            className="w-4 h-4 text-(--color-primary) rounded border-gray-300 focus:ring-(--color-primary)"
                          />
                          <span className="text-xs text-gray-700">{campo.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {camposIncorrectos.length > 0 && (
                  <div className="mt-3 p-3 bg-(--color-primary)/5 border border-(--color-primary)/20 rounded-lg">
                    <p className="text-xs text-(--color-primary) font-semibold">
                      {camposIncorrectos.length} campo(s) seleccionado(s) para corrección
                    </p>
                  </div>
                )}
              </div>

              {/* Justificación */}
              <div>
                <label htmlFor="editMotivo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Justificación de la Solicitud <span className="text-(--color-primary)">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Explique brevemente por qué estos campos son incorrectos.
                </p>
                <textarea
                  id="editMotivo"
                  value={motivo}
                  onChange={(e) => dispatch({ type: 'SET_MOTIVO', payload: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) outline-none transition-all resize-none shadow-inner disabled:bg-gray-50 disabled:text-gray-400"
                  rows={4}
                  placeholder="Ej. El color declarado es 'Rojo' pero en la fotografía del frente se observa color 'Vino'. El VIN tiene un dígito incorrecto."
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl shrink-0">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                disabled={camposIncorrectos.length === 0 || !motivo.trim() || isSubmitting}
                onClick={handleSubmit}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm flex items-center justify-center min-w-44 ${
                  isSubmitting
                    ? 'bg-(--color-primary)/70 cursor-wait'
                    : 'bg-(--color-primary) hover:bg-violet-900 disabled:opacity-50'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-transparent animate-spin"></div>
                    Enviando...
                  </span>
                ) : 'Oficializar Solicitud'}
              </button>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.getElementById('modal-root') || document.body
  );
};

export default RequestCorrectionModal;
