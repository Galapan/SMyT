import { AlertTriangle } from 'lucide-react';

const EnvironmentalSection = ({ formData, errors, onChange, getInputClass }) => {
  const environmentalItems = [
    { label: 'Aceite de Motor', statusKey: 'estatusAceite', cantKey: 'cantAceite' },
    { label: 'Anticongelante', statusKey: 'estatusAnticongelante', cantKey: 'cantAnticongelante' },
    { label: 'Combustible', statusKey: 'estatusCombustible', cantKey: 'cantCombustible' }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <AlertTriangle size={20} className="text-gray-700" />
        <h4 className="font-semibold text-gray-800">Control Ambiental (Crítico)</h4>
      </div>
      <div className="p-6 space-y-4">
        {environmentalItems.map((row) => {
          const isDisabled = formData[row.statusKey] === 'DRENADO';
            <div key={row.label} className={`grid grid-cols-1 md:grid-cols-3 gap-4 items-start p-4 border rounded-xl transition-colors ${errors[row.statusKey] || errors[row.cantKey] ? 'border-red-300' : 'border-gray-200'} ${isDisabled ? 'opacity-70 bg-gray-50' : 'bg-white'}`}>
              <span className="text-sm font-semibold text-gray-700 mt-2">{row.label}</span>
              <div className="w-full">
                <div className="relative">
                  <select 
                    name={row.statusKey} 
                    value={formData[row.statusKey]} 
                    onChange={onChange} 
                    className={`w-full h-10 px-3 pr-8 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all text-sm ${errors[row.statusKey] ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Estatus...</option>
                    <option value="DRENADO">Drenado</option>
                    <option value="PRESENTE">Presente</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
                {errors[row.statusKey] && <span className="text-xs text-red-500 font-medium mt-1 block">{errors[row.statusKey]}</span>}
              </div>
              
              <div className="w-full">
                <input 
                  type="text" 
                  name={row.cantKey} 
                  value={formData[row.cantKey]} 
                  onChange={onChange} 
                  disabled={isDisabled}
                  placeholder={isDisabled ? "N/A - Drenado" : "Cantidad (ej. 25%, 2L)"}
                  className={`w-full h-10 px-3 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors text-sm ${errors[row.cantKey] ? 'border-red-500' : 'border-gray-300'} ${isDisabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : ''}`}
                />
                {errors[row.cantKey] && <span className="text-xs text-red-500 font-medium mt-1 block">{errors[row.cantKey]}</span>}
              </div>
            </div>
        })}
      </div>
    </div>
  );
};

export default EnvironmentalSection;
