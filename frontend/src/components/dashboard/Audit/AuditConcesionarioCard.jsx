import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Warehouse, Car, Users, User, ShieldCheck, X, Eye } from 'lucide-react';

const AuditConcesionarioCard = ({ deposito }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  // Helpers
  const ocupacion = deposito.capacidad > 0 
    ? Math.round((deposito._count.vehiculos / deposito.capacidad) * 100) 
    : 0;

  const getOcupacionColor = (pct) => {
    if (pct >= 90) return 'text-red-600 bg-red-50 border-red-200';
    if (pct >= 75) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const hasUsers = deposito.usuarios && deposito.usuarios.length > 0;

  return (
    <div 
      className="relative w-full h-64 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between cursor-pointer hover:border-(--color-primary)/30 transition-colors"
      onClick={() => !isFlipped && setIsFlipped(true)}
    >
      
      {/* Front Face: Resumen del Depósito */}
      <div className={`flex flex-col h-full justify-between transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Encabezado */}
        <div>
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-(--color-primary)/5 rounded-xl">
              <Warehouse size={22} className="text-(--color-primary)" />
            </div>
            <div className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getOcupacionColor(ocupacion)}`}>
              {ocupacion}% Ocupado
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={deposito.nombre}>
            {deposito.nombre}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            {deposito.municipio}
          </p>
        </div>

        {/* Cifras rápidas (footer del front) */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Car size={12} /> Vehículos
            </span>
            <span className="text-lg font-bold text-gray-800">
              {deposito._count.vehiculos} <span className="text-sm font-medium text-gray-400 block sm:inline">/ {deposito.capacidad} max</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users size={12} /> Cuentas
            </span>
            <span className="text-lg font-bold text-gray-800">
              {deposito.usuarios?.length || 0} vinculadas
            </span>
          </div>
        </div>
      </div>

      {/* Back Face Overlay: Cuentas Vinculadas */}
      <div 
        className={`absolute inset-0 w-full h-full bg-white/95 backdrop-blur-sm rounded-2xl border border-(--color-primary) shadow-lg p-1 flex flex-col transition-all duration-300 ease-out z-20 overflow-hidden ${isFlipped ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        
        {/* Cabecera del reverso */}
        <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 rounded-t-xl shrink-0 flex items-center justify-between">
            <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <ShieldCheck size={16} className="text-(--color-primary)" />
                Cuentas Autorizadas
            </h4>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600 font-medium hidden sm:inline-block">
                  {deposito.usuarios?.length || 0} vinculadas
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-white rounded-md transition-colors"
                title="Cerrar detalles"
              >
                <X size={16} />
              </button>
            </div>
        </div>

        {/* Lista de Usuarios */}
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar p-3 space-y-2">
          {!hasUsers ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <User size={24} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 font-medium">No hay cuentas asignadas</p>
              <p className="text-xs text-gray-400 mt-1">Este depósito no tiene administradores vinculados en el sistema.</p>
            </div>
          ) : (
            deposito.usuarios.map(user => (
              <div key={user.id} className="group/user flex items-center p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors">
                
                {/* Avatar */}
                <div className="h-10 w-10 shrink-0 rounded-full border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <img 
                    src={(user.fotoUrl && !user.fotoUrl.includes('name=User')) ? user.fotoUrl : `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(user.nombre + ' ' + user.apellido)}`} 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Data */}
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user.nombre} {user.apellido}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 ml-2">
                   <div className={`w-2 h-2 rounded-full ${user.activo ? 'bg-green-500' : 'bg-red-500'}`} title={user.activo ? 'Cuenta Activa' : 'Cuenta Inactiva'} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Button to navigate to details */}
        <div className="p-3 border-t border-gray-100 bg-white rounded-b-xl shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/admin/auditoria/${deposito.id}`); }}
            className="w-full py-2.5 bg-(--color-primary) text-white font-medium text-sm rounded-lg hover:bg-violet-900 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            Inspeccionar Concesionario
          </button>
        </div>
      </div>

    </div>
  );
};

export default AuditConcesionarioCard;
