import { useState } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Edit3, X, Car } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

const RequestCorrectionModal = ({ isOpen, onClose, vehiculo, onSuccess }) => {
  const [motivo, setMotivo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !vehiculo) return null;

  const handleSubmit = async () => {
    if (!motivo.trim()) return;
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/solicitudes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ vehiculoId: vehiculo.id, motivo })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setMotivo('');
        onSuccess(`Solicitud enviada exitosamente para folio ${vehiculo.folioProceso}`);
      } else {
        setErrorMsg(data.message || 'Error al enviar solicitud');
      }
    } catch (error) {
      setErrorMsg('Error de conexión con el servidor. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 z-10"
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
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label htmlFor="editMotivo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Justificación de la Solicitud <span className="text-(--color-primary)">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Señala con precisión qué campos del Expediente no concuerdan con la Evidencia Fotográfica o están mal capturados.
                </p>
                <textarea 
                  id="editMotivo"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) outline-none transition-all resize-none shadow-inner disabled:bg-gray-50 disabled:text-gray-400"
                  rows={5}
                  placeholder="Ej. El color declarado es 'Rojo' pero en la fotografía del frente se observa color 'Vino'. Además en placa le falta un dígito. Favor de corregir."
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
                disabled={!motivo.trim() || isSubmitting}
                onClick={handleSubmit}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm flex items-center justify-center min-w-44 ${isSubmitting ? 'bg-(--color-primary)/70 cursor-wait' : 'bg-(--color-primary) hover:bg-violet-900 disabled:opacity-50'}`}
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
