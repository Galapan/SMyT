import FormSelect from '../../FormFields/FormSelect';
import { Cog } from 'lucide-react';

const MechanicalSection = ({ formData, errors, onChange, getInputClass }) => {
  
  const getStatusStyle = (val, type = 'default') => {
      if (!val) return 'border-gray-200 bg-white';
      
      if (type === 'binary') {
        return val === 'BUENO' || val === 'FUNCIONAL' || val === 'AUTOMATICA' || val === 'MANUAL'
            ? 'border-green-200 bg-green-50 text-green-700 shadow-sm' 
            : 'border-red-200 bg-red-50 text-red-700';
      }
      return 'border-gray-200 bg-white';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
           <Cog size={20} className="text-(--color-primary)" />
        </div>
        <h4 className="font-bold text-gray-800 text-lg">Mecánica y Sistemas</h4>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Motores y Bateria - Tarjetas grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-xl border-2 transition-all ${getStatusStyle(formData.estadoMotor, 'binary')}`}>
                 <label className="block text-sm font-bold opacity-70 mb-2">Estado del Motor</label>
                 <select
                    name="estadoMotor"
                    value={formData.estadoMotor}
                    onChange={onChange}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-semibold text-lg cursor-pointer"
                 >
                    <option value="">Seleccionar...</option>
                    <option value="BUENO">Bueno / Completo</option>
                    <option value="MALO">Malo / Incompleto</option>
                    <option value="FALTANTE">Faltante</option>
                 </select>
            </div>

            <div className={`p-4 rounded-xl border-2 transition-all ${getStatusStyle(formData.estadoBateria, 'binary')}`}>
                 <label className="block text-sm font-bold opacity-70 mb-2">Batería</label>
                 <select
                    name="estadoBateria"
                    value={formData.estadoBateria}
                    onChange={onChange}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-semibold text-lg cursor-pointer"
                 >
                    <option value="">Seleccionar...</option>
                    <option value="BUENO">Presente / Funciona</option>
                    <option value="MALO">Dañada</option>
                    <option value="FALTANTE">Faltante</option>
                 </select>
            </div>
        </div>

        {/* Detalles secundarios */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Transmisión</label>
            <div className="relative">
                <select 
                  name="tipoTransmision" 
                  value={formData.tipoTransmision} 
                  onChange={onChange} 
                  className="w-full h-12 pl-4 pr-8 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-(--color-primary)/20 transition-all font-medium"
                >
                  <option value="">Tipo...</option>
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATICA">Automática</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Sistema de Frenos</label>
             <div className="relative">
                <select 
                  name="estadoFrenos" 
                  value={formData.estadoFrenos} 
                  onChange={onChange} 
                  className={`w-full h-12 pl-4 pr-8 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all font-medium ${
                      formData.estadoFrenos === 'FALLA' ? 'bg-red-50 text-red-700' : 'bg-gray-50'
                  }`}
                >
                  <option value="">Estado...</option>
                  <option value="FUNCIONAL">Funcional</option>
                  <option value="FALLA">Con Falla</option>
                </select>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicalSection;
