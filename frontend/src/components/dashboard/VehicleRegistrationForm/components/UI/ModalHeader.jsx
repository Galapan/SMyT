import { X } from 'lucide-react';

const ModalHeader = ({ onClose }) => {
  return (
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
    </div>
  );
};

export default ModalHeader;
