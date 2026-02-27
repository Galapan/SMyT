import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Car, FileText, Image as ImageIcon, 
  ShieldAlert, Settings, AlertTriangle, CheckCircle2,
  Calendar, FileCode2, MapPin, Edit3, X, User
} from 'lucide-react';
import dayjs from 'dayjs';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const SectionHeader = ({ icon: Icon, title, status }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-gray-600" />
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    {status && (
      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${status.color}`}>
        {status.label}
      </span>
    )}
  </div>
);

const DataRow = ({ label, value, isHighlight }) => (
  <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className={`text-sm font-medium ${isHighlight ? 'text-gray-900 font-bold bg-gray-100 px-2 py-0.5 rounded border border-gray-200' : 'text-gray-900'}`}>
      {value || 'N/A'}
    </span>
  </div>
);

const VehicleAdminDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRol, setUserRol] = useState('');

  // Modal y Toast State para Solicitud de Edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMotivo, setEditMotivo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' }); // type: success | error
  const [selectedImage, setSelectedImage] = useState(null);

  // Configuración de física de resortes para Framer Motion
  const springConfig = { 
    type: 'spring', 
    damping: 25, 
    stiffness: 300,
    mass: 0.8
  };

  const showNotification = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'success' });
    }, 4000);
  };

  useEffect(() => {
    const fetchVehicleData = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        setUserRol(user?.rol || '');

        const response = await fetch(`${API_URL}/api/vehiculos/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setVehiculo(data.data);
        } else {
          navigate('/admin/auditoria');
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVehicleData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="h-full flex flex-col space-y-6 animate-pulse">
        <div className="h-20 w-full bg-white rounded-xl border border-gray-100"></div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white rounded-xl border border-gray-100"></div>
          <div className="lg:col-span-1 h-96 bg-white rounded-xl border border-gray-100"></div>
        </div>
      </div>
    );
  }

  if (!vehiculo) return null;

  // Helpers visuales
  const getEstatusStyle = (estatus) => {
    switch(estatus) {
      case 'ROBADO': return { label: estatus, color: 'text-red-700 bg-red-50 border-red-200' };
      case 'DECOMISADO': return { label: estatus, color: 'text-orange-700 bg-orange-50 border-orange-200' };
      case 'SINIESTRADO': return { label: estatus, color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
      default: return { label: estatus, color: 'text-gray-700 bg-gray-100 border-gray-200' };
    }
  };

  const getConditionColor = (val) => {
    if (val === 'BUENO' || val === true) return <CheckCircle2 size={16} className="text-green-500" />;
    if (val === 'MALO' || val === false) return <AlertTriangle size={16} className="text-red-500" />;
    return <span className="text-gray-400 text-xs text-center w-full block">-</span>;
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pb-4">
      {/* Header del Expediente */}
      <div className="shrink-0 bg-white rounded-xl border border-gray-200 p-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            title="Atrás"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Expediente de Vehículo</h1>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold border border-gray-200 bg-gray-100 text-gray-700">
                Folio: {vehiculo.folioProceso}
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
              <MapPin size={14} className="text-gray-400" />
              Depósito: <span className="font-semibold text-gray-700">{vehiculo.deposito?.nombre}</span>
              <span className="mx-1 text-gray-300">|</span>
              <Calendar size={14} className="text-gray-400" />
              Ingreso: {dayjs(vehiculo.fechaIngreso).format('DD MMM YYYY, HH:mm')}
            </p>
          </div>
        </div>

        {/* Action Button - Oculto para Super Usuario */}
        {userRol !== 'SUPER_USUARIO' && (
          <button 
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 hover:shadow-sm border border-red-200 rounded-lg text-sm font-semibold transition-all"
          >
            <AlertTriangle size={16} />
            Solicitar Corrección de Datos
          </button>
        )}
      </div>

      {/* Grid de Expediente */}
      <div className="flex-1 pb-6 space-y-6">
        
        {/* Galería Fotográfica */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader icon={ImageIcon} title="Evidencia Fotográfica" />
          <div className="p-6">
            {!vehiculo.fotos || vehiculo.fotos.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                <ImageIcon size={32} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No hay fotografías registradas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {vehiculo.fotos.map((foto, idx) => (
                    <motion.div 
                      layoutId={`foto-container-${foto}`}
                      transition={springConfig}
                      key={idx} 
                      className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group relative cursor-pointer"
                      onClick={() => setSelectedImage(foto)}
                      whileHover="hover"
                    >
                      {selectedImage !== foto && (
                        <motion.img 
                          layoutId={`foto-img-${foto}`}
                          transition={springConfig}
                          variants={{ hover: { scale: 1.05 } }}
                          src={foto} 
                          alt={`Evidencia ${idx+1}`} 
                          className="w-full h-full object-cover" 
                        />
                      )}
                      
                      {/* Hover Overlay */}
                      <motion.div 
                        variants={{ hover: { opacity: 1 } }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/20 flex items-center justify-center"
                      >
                        <motion.div variants={{ hover: { scale: 1.1, opacity: 1 } }} initial={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }}>
                           <ImageIcon size={28} className="text-white drop-shadow-lg" />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filas de Información */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Identificación del Vehículo */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-1">
            <SectionHeader icon={Car} title="Identidad del Vehículo" />
            <div className="p-5 space-y-1">
              <DataRow label="Marca/Línea" value={vehiculo.marcaTipo} />
              <DataRow label="Modelo (Año)" value={vehiculo.anio} />
              <DataRow label="Placas" value={vehiculo.placa} isHighlight />
              <DataRow label="Número de VIN" value={vehiculo.vin} isHighlight />
              <DataRow label="Motor" value={vehiculo.noMotor} />
              <DataRow label="Color Original" value={vehiculo.colorOriginal} />
               <DataRow label="Color Actual" value={vehiculo.colorActual} />
              <DataRow label="Odómetro" value={`${vehiculo.odometro} km`} />
              <DataRow label="Tipo Servicio" value={vehiculo.tipoServicio} />
            </div>
          </div>

          {/* Legal / Administrativo */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-1">
             <SectionHeader icon={ShieldAlert} title="Situación Legal" status={getEstatusStyle(vehiculo.estatusLegal)} />
             <div className="p-5 space-y-1">
              <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                 <p className="text-xs text-gray-500 mb-1">Autoridad Remitente</p>
                 <p className="text-sm font-semibold text-gray-900">{vehiculo.autoridad}</p>
              </div>
              <DataRow label="¿Tiene Acta de Baja?" value={vehiculo.tieneActaBaja ? 'Sí' : 'No'} />
              <DataRow label="No. de Oficio" value={vehiculo.noOficio} />
              <DataRow label="Fecha Acta de Baja" value={vehiculo.fechaActaBaja ? dayjs(vehiculo.fechaActaBaja).format('DD MMM YYYY') : null} />
              <DataRow label="¿Tiene Título/Factura?" value={vehiculo.tieneTituloFactura ? 'Sí' : 'No'} />
             </div>
          </div>

          {/* Estado Físico */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-1 flex flex-col">
            <SectionHeader icon={Settings} title="Inspección de Hardware" />
            <div className="p-5 flex-1 flex flex-col justify-between">
               
               <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                  <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="text-gray-600">Carrocería</span> {getConditionColor(vehiculo.estadoCarroceria)}
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="text-gray-600">Cristales</span> {getConditionColor(vehiculo.estadoCristales)}
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="text-gray-600">Motor Intacto</span> {getConditionColor(vehiculo.motorCompleto)}
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="text-gray-600">Batería</span> {getConditionColor(vehiculo.bateriaPresente)}
                  </div>
               </div>

               <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Observaciones del Inspector</p>
                  <p className="text-sm text-gray-700 bg-yellow-50/50 p-3 rounded-xl border border-yellow-100 min-h-15">
                    {vehiculo.observacionesInspector || 'Ninguna observación capturada durante la recepción.'}
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL SOLICITUD EDICIÓN - RENDERIZADO FUERA DEL DOM TREE USANDO PORTAL */}
       {showEditModal && createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowEditModal(false)}
          />
          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-(--color-primary)/5 shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 size={20} className="text-(--color-primary)" />
                <h3 className="text-lg font-bold text-gray-900">Solicitar Corrección de Registro</h3>
              </div>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditMotivo('');
                }} 
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Justificación de la Solicitud <span className="text-(--color-primary)">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Señala con precisión qué campos del Expediente no concuerdan con la Evidencia Fotográfica o están mal capturados.
                </p>
                <textarea 
                  value={editMotivo}
                  onChange={(e) => setEditMotivo(e.target.value)}
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
                onClick={() => {
                  setShowEditModal(false);
                  setEditMotivo('');
                }} 
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                disabled={!editMotivo.trim() || isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
                    const res = await fetch(`${API_URL}/api/solicitudes`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({ vehiculoId: vehiculo.id, motivo: editMotivo })
                    });
                    
                    if (res.ok) {
                      setEditMotivo('');
                      setShowEditModal(false); 
                      showNotification(`Solicitud enviada exitosamente para folio ${vehiculo.folioProceso}`);
                    } else {
                      const data = await res.json();
                      showNotification(data.message || 'Error al enviar solicitud', 'error');
                    }
                  } catch (error) {
                    showNotification('Error de conexión con el servidor', 'error');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm flex items-center justify-center min-w-35 ${isSubmitting ? 'bg-(--color-primary)/70 cursor-wait' : 'bg-(--color-primary) hover:bg-violet-900 disabled:opacity-50'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    Enviando
                  </span>
                ) : 'Oficializar Solicitud'}
              </button>
            </div>
          </div>
        </div>,
        document.getElementById('modal-root') || document.body
      )}

      {/* Floating Toast Notification */}
      {toast.visible && (
        <div className={`fixed bottom-6 right-6 z-60 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={20} className="text-green-500 shrink-0" />
          ) : (
            <AlertTriangle size={20} className="text-red-500 shrink-0" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Fullscreen Image Viewer via Framer Motion with Persistent Portal */}
      {createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md cursor-zoom-out"
              style={{ zIndex: 120 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.1 }}
                className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/80 rounded-full transition-colors backdrop-blur-sm z-10"
                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              >
                <X size={24} />
              </motion.button>
              
              <motion.div
                layoutId={`foto-container-${selectedImage}`}
                transition={springConfig}
                className="max-w-full max-h-full flex items-center justify-center cursor-default bg-transparent"
                onClick={(e) => e.stopPropagation()}
                style={{ width: '100%', height: '100%' }}
              >
                <motion.img 
                  layoutId={`foto-img-${selectedImage}`}
                  transition={springConfig}
                  src={selectedImage} 
                  alt="Zoom preview" 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl bg-transparent relative z-10"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.getElementById('modal-root') || document.body
      )}

    </div>
  );
};

export default VehicleAdminDetail;
