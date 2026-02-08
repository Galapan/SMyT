import { AlertTriangle } from 'lucide-react';

const EnvironmentalSection = ({ formData, errors, onChange, getInputClass }) => {
  const environmentalItems = [
    { label: 'Aceite de Motor', statusKey: 'estatusAceite', cantKey: 'cantAceite' },
    { label: 'Anticongelante', statusKey: 'estatusAnticongelante', cantKey: 'cantAnticongelante' },
    { label: 'Combustible', statusKey: 'estatusCombustible', cantKey: 'cantCombustible' }
  ];

  return (
    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
      <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2 border-b border-red-200 pb-2">
        <AlertTriangle size={18} />
        Control Ambiental (Crítico)
      </h4>
      <div className="space-y-3">
        {environmentalItems.map((row) => {
          const isDisabled = formData[row.statusKey] === 'DRENADO';
          return (
            <div key={row.label} className={`grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-white/50 p-3 rounded-lg transition-opacity ${isDisabled ? 'opacity-60' : ''}`}>
              <span className="text-sm font-bold text-gray-700">{row.label}</span>
              <select 
                name={row.statusKey} 
                value={formData[row.statusKey]} 
                onChange={onChange} 
                className={getInputClass(row.statusKey)}
              >
                <option value="">Estatus...</option>
                <option value="DRENADO">Drenado</option>
                <option value="PRESENTE">Presente</option>
              </select>
              <input 
                type="text" 
                name={row.cantKey} 
                value={formData[row.cantKey]} 
                onChange={onChange} 
                disabled={isDisabled}
                placeholder={isDisabled ? "N/A - Drenado" : "Cantidad Estimada (ej. 25%, 2L)"}
                className={`${getInputClass(row.cantKey)} ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnvironmentalSection;
