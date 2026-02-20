import FormSelect from '../../FormFields/FormSelect';
import { Cog } from 'lucide-react';

const MechanicalSection = ({ formData, errors, onChange, getInputClass }) => {
  
  const getStatusStyle = (val, fieldName) => {
      if (errors[fieldName]) return 'border-red-500 bg-white';
      return 'border-gray-200 bg-white';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <Cog size={20} className="text-gray-700" />
        <h4 className="font-semibold text-gray-800">Mecánica y Sistemas</h4>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Motores y Bateria - Tarjetas grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-xl border transition-all ${getStatusStyle(formData.estadoMotor, 'estadoMotor')}`}>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Estado del Motor</label>
                 <select
                    name="estadoMotor"
                    value={formData.estadoMotor}
                    onChange={onChange}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium text-base cursor-pointer outline-none"
                 >
                    <option value="">Seleccionar...</option>
                    <option value="BUENO">Bueno / Completo</option>
                    <option value="MALO">Malo / Incompleto</option>
                    <option value="FALTANTE">Faltante</option>
                 </select>
                 {errors.estadoMotor && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.estadoMotor}</span>}
            </div>

            <div className={`p-4 rounded-xl border transition-all ${getStatusStyle(formData.estadoBateria, 'estadoBateria')}`}>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Batería</label>
                 <select
                    name="estadoBateria"
                    value={formData.estadoBateria}
                    onChange={onChange}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium text-base cursor-pointer outline-none"
                 >
                    <option value="">Seleccionar...</option>
                    <option value="BUENO">Presente / Funciona</option>
                    <option value="MALO">Dañada</option>
                    <option value="FALTANTE">Faltante</option>
                 </select>
                 {errors.estadoBateria && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.estadoBateria}</span>}
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
                  className={`w-full h-10 px-3 pr-8 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all text-sm ${errors.tipoTransmision ? 'border-red-500' : 'border-gray-200'}`}
                >
                  <option value="">Tipo...</option>
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATICA">Automática</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
            {errors.tipoTransmision && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.tipoTransmision}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Sistema de Frenos</label>
             <div className="relative">
                <select 
                  name="estadoFrenos" 
                  value={formData.estadoFrenos} 
                  onChange={onChange} 
                  className={`w-full h-10 px-3 pr-8 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all text-sm ${errors.estadoFrenos ? 'border-red-500' : 'border-gray-200'}`}
                >
                  <option value="">Estado...</option>
                  <option value="FUNCIONAL">Funcional</option>
                  <option value="FALLA">Con Falla</option>
                </select>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
             </div>
             {errors.estadoFrenos && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.estadoFrenos}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicalSection;
