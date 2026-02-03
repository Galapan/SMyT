import { X, Save, MapPin, Building, User } from 'lucide-react';

const NewDepotModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Nuevo Depósito</h3>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Concesionario</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej. Grúas del Valle"
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
              />
              <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación / Dirección</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Calle, Número, Colonia..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
              />
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre del encargado"
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
              />
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="flex space-x-4">
             <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                    type="tel"
                    placeholder="555-000-0000"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                />
             </div>
             <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad (Vehículos)</label>
                <input
                    type="number"
                    placeholder="200"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                />
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-violet-900 rounded-lg shadow-sm flex items-center transition-all active:scale-95">
            <Save size={16} className="mr-2" />
            Guardar Depósito
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewDepotModal;
