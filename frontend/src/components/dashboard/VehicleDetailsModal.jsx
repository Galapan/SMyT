import React from 'react';
import { createPortal } from 'react-dom';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Search, Maximize2, FileText, CheckCircle, ShieldAlert, Image as ImageIcon, Car } from 'lucide-react';

const VehicleDetailsModal = ({ isOpen, onClose, vehiculo }) => {
  const [selectedPhoto, setSelectedPhoto] = React.useState(null);

  // Render outside of the regular DOM hierarchy
  return createPortal(
    <AnimatePresence>
      {isOpen && vehiculo && (
        <LazyMotion features={domAnimation}>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:py-8 lg:p-12 overflow-y-auto">
                {/* Backdrop overlay */}
                <m.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-gray-800/40 backdrop-blur-md" 
                  onClick={onClose} 
                  aria-hidden="true"
                />

                {/* Modal Window */}
                <m.div 
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } }}
                    exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }}
                    className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] lg:max-h-[85vh] z-10 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex-none px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                        <div className="flex items-center gap-4">
                            <div className="bg-violet-100 text-(--color-primary) p-3 rounded-2xl">
                                <Maximize2 size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">Expediente del Vehículo</h2>
                                <p className="text-sm font-medium text-gray-500 mt-0.5">Folio: <span className="text-(--color-primary)">{vehiculo.folioProceso}</span></p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={onClose}
                            className="p-2 sm:p-2.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                            aria-label="Cerrar detalles"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Content Wrapper to fix corner clipping */}
                    <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-gray-50/50">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Left Column */}
                            <div className="space-y-8">
                                
                                {/* Status Banner (simulated) */}
                                <div className={`p-5 rounded-2xl flex items-start gap-4 shadow-sm border ${
                                    vehiculo.estatusLegal === 'ROBADO' ? 'bg-red-50 border-red-100 text-red-800' :
                                    vehiculo.estatusLegal === 'DECOMISADO' ? 'bg-orange-50 border-orange-100 text-orange-800' :
                                    vehiculo.estatusLegal === 'SINIESTRADO' ? 'bg-yellow-50 border-yellow-100 text-yellow-800' :
                                    'bg-gray-50 border-gray-200 text-gray-800'
                                }`}>
                                    <ShieldAlert className="shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold uppercase tracking-wider text-sm mb-1">{vehiculo.estatusLegal}</h3>
                                        <p className="text-sm opacity-90">Este vehículo mantiene un estatus legal registrado al momento del ingreso. Validar el acta correspondiente.</p>
                                    </div>
                                </div>

                                {/* Vehicle Basics */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Car size={16} /> Identificación Básica
                                    </h3>
                                    
                                    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm">
                                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                                            <span className="text-gray-500 font-medium text-sm">Marca / Tipo</span>
                                            <span className="font-bold text-gray-900">{vehiculo.marcaTipo}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                                            <span className="text-gray-500 font-medium text-sm">Año del Modelo</span>
                                            <span className="font-bold text-gray-900">{vehiculo.anio}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                                            <span className="text-gray-500 font-medium text-sm">Placas</span>
                                            <span className="bg-gray-100 font-mono font-bold px-2 py-1 rounded text-gray-700">{vehiculo.placa}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 font-medium text-sm">Color Visual</span>
                                            <span className="font-bold text-gray-900 capitalize">{vehiculo.colorActual}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Photo Gallery */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Search size={16} /> Registro Fotográfico
                                    </h3>
                                    
                                    {vehiculo.fotos && vehiculo.fotos.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {vehiculo.fotos.map((foto, index) => (
                                                <div 
                                                    key={index} 
                                                    onClick={() => setSelectedPhoto(foto)}
                                                    className="aspect-4/3 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center relative group overflow-hidden cursor-pointer"
                                                >
                                                    <img 
                                                        src={foto} 
                                                        alt={`Evidencia fotográfica ${index + 1}`} 
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Maximize2 size={24} className="text-white drop-shadow-md" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                                            <div className="p-3 bg-white rounded-full text-gray-400 mb-3 shadow-sm">
                                                <ImageIcon size={24} />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">Sin registro fotográfico</p>
                                            <p className="text-xs text-gray-500 mt-1">No se adjuntaron imágenes en el expediente</p>
                                        </div>
                                    )}
                                </div>
                                
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                
                                {/* Administrative Details */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <FileText size={16} /> Detalles Administrativos
                                    </h3>
                                    
                                    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5"><MapPin size={18}/></div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Ubicación Actual</p>
                                                <p className="font-bold text-gray-900 pt-0.5">Depósito ID: {vehiculo.depositoId}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-4 pt-3 border-t border-gray-50">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0 mt-0.5"><Calendar size={18}/></div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Fecha de Ingreso Oficial</p>
                                                <p className="font-bold text-gray-900 pt-0.5">{new Date(vehiculo.fechaIngreso).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                                <p className="text-sm text-gray-500 leading-snug mt-1">Registrado en sistema con el inventario #{vehiculo.noInventario || 'Pendiente'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Deep technical details (VIN etc) */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <CheckCircle size={16} /> Verificación Técnica
                                    </h3>
                                    
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Número de Identificación Vehicular (VIN)</span>
                                            <kbd className="px-3 py-1 bg-white border border-gray-200 rounded text-sm font-mono font-bold text-(--color-primary) shadow-sm">
                                                {vehiculo.vin}
                                            </kbd>
                                        </div>
                                        <div className="p-5 space-y-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">Motor</p>
                                                    <p className="font-medium text-gray-900 truncate">{vehiculo.noMotor || 'No legible/ausente'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">Odómetro</p>
                                                    <p className="font-medium text-gray-900">{vehiculo.odometro ? `${vehiculo.odometro.toLocaleString()} km` : 'Desconocido'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                        <div className="mt-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Observaciones del Inspector</p>
                                            <p className="text-sm text-gray-700 leading-relaxed italic">
                                                "{vehiculo.observacionesInspector || 'Ninguna observación adicional registrada durante el ingreso físico del vehículo al depósito.'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </m.div>

                {/* Expanded Photo Viewer */}
                <AnimatePresence>
                    {selectedPhoto && (
                        <m.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <button 
                                onClick={() => setSelectedPhoto(null)}
                                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                            >
                                <X size={24} />
                            </button>
                            <m.img 
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                src={selectedPhoto} 
                                alt="Foto ampliada del vehículo" 
                                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </LazyMotion>
      )}
    </AnimatePresence>,
    document.getElementById('modal-root') || document.body
  );
};

export default VehicleDetailsModal;
