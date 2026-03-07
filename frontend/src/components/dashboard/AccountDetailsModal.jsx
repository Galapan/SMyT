import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Warehouse, Calendar, Mail, X, CheckCircle, XCircle } from 'lucide-react';

const AccountDetailsModal = ({ isOpen, onClose, user }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!user) return null;

  const getRoleLabel = (rol) => {
    const roles = {
      'SUPER_USUARIO': 'Super Usuario',
      'ADMINISTRADOR_SMYT': 'Administrador SMyT',
      'USUARIO_CONCESIONARIO': 'Concesionario'
    };
    return roles[rol] || rol;
  };

  const getRoleColor = (rol) => {
    const colors = {
      'SUPER_USUARIO': 'text-red-700 bg-red-100 ring-red-300',
      'ADMINISTRADOR_SMYT': 'text-blue-700 bg-blue-100 ring-blue-300',
      'USUARIO_CONCESIONARIO': 'text-emerald-700 bg-emerald-100 ring-emerald-300'
    };
    return colors[rol] || 'text-gray-700 bg-gray-100 ring-gray-200';
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: 'spring', damping: 25, stiffness: 300 } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 } 
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-gray-800/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col z-10"
          >
            <div className="p-8">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-gray-100/50 hover:bg-gray-200/80 text-gray-500 hover:text-gray-800 rounded-full transition-all z-10"
              >
                <X size={20} />
              </button>

              {/* Profile Header */}
              <div className="flex flex-col items-center mb-8 relative mt-2">
                {/* Status Badge - Floating */}
                <div className="absolute top-0 w-full flex justify-center -mt-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 shadow-[0_4px_10px_rgba(0,0,0,0.05)] text-xs font-semibold rounded-full border ${user.activo ? 'bg-gob-verde/5 text-gob-verde border-gob-verde' : 'bg-gob-rosa/10 text-gob-rosa border-gob-rosa'}`}>
                    {user.activo ? <CheckCircle size={14} className="text-gob-verde"/> : <XCircle size={14} className="text-gob-rosa"/>}
                    {user.activo ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                  </span>
                </div>

                {/* Avatar */}
                <div className="mt-8 mb-4 relative group">
                  <div className="absolute inset-0 bg-linear-to-tr from-(--color-primary) to-violet-300 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="h-32 w-32 shrink-0 rounded-full bg-white overflow-hidden shadow-lg relative z-10 border-4 border-white">
                    <img 
                      src={(user.fotoUrl && !user.fotoUrl.includes('name=User')) 
                        ? user.fotoUrl 
                        : `https://ui-avatars.com/api/?background=random&color=fff&size=512&name=${encodeURIComponent(user.nombre + ' ' + user.apellido)}`} 
                      alt="avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Name and Email */}
                <div className="text-center">
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">
                    {user.nombre} {user.apellido}
                  </h2>
                  <div className="inline-flex items-center justify-center mt-2 px-3 py-1.5 bg-gray-100 rounded-full text-gray-600 transition-colors hover:bg-violet-50 hover:text-(--color-primary)">
                    <Mail size={14} className="mr-2" />
                    <a href={`mailto:${user.email}`} className="text-sm font-medium">{user.email}</a>
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="space-y-3">
                {/* Role Card */}
                <div className="bg-white/60 p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center hover:shadow-md transition-shadow">
                  <div className={`p-3 rounded-xl shrink-0 mr-4 flex items-center justify-center ${
                    user.rol === 'SUPER_USUARIO' ? 'bg-red-100 text-red-700' :
                    user.rol === 'ADMINISTRADOR_SMYT' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nivel de Acceso</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-lg ring-1 ring-inset ${getRoleColor(user.rol)}`}>
                      {getRoleLabel(user.rol)}
                    </span>
                  </div>
                </div>

                {/* Deposit Card (Conditional) */}
                {user.rol === 'USUARIO_CONCESIONARIO' && (
                  <div className={`bg-white/60 p-4 rounded-2xl border flex items-center shadow-sm hover:shadow-md transition-shadow ${user.deposito ? 'border-gray-100' : 'border-gob-rosa bg-orange-50/30'}`}>
                    <div className={`p-3 rounded-xl shrink-0 mr-4 flex items-center justify-center ${user.deposito ? 'bg-gray-50 text-gray-500' : 'bg-gob-rosa/15 text-gob-rosa'}`}>
                      <Warehouse className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${user.deposito ? 'text-gray-400' : 'text-gob-rosa'}`}>
                        {user.deposito ? 'Depósito Asignado' : 'Asignación Pendiente'}
                      </p>
                      <p className={`text-[15px] font-bold ${user.deposito ? 'text-gray-900' : 'text-gob-rosa'}`}>
                        {user.deposito ? user.deposito.nombre : 'Sin asignación actual'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Creation Date Card */}
                <div className="bg-white/60 p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center hover:shadow-md transition-shadow">
                  <div className="p-3 bg-gray-50 text-gray-500 rounded-xl shrink-0 mr-4 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cuenta creada</p>
                    <p className="text-[15px] font-bold text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Gradient Decor */}
            <div className="h-4 w-full bg-linear-to-t from-gray-50 to-transparent absolute bottom-0 pointer-events-none rounded-b-3xl"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.getElementById('modal-root') || document.body
  );
};

export default AccountDetailsModal;
