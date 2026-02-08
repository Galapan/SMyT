import { Armchair } from 'lucide-react';

const InteriorSection = ({ formData, errors, onChange, getInputClass }) => {
  const interiorFields = [
    { label: 'Asientos', name: 'estadoAsientos', options: ['BUENO', 'REGULAR', 'MALO'], obsName: 'obsAsientos' },
    { label: 'Cinturones', name: 'estadoCinturones', options: ['COMPLETOS', 'INCOMPLETOS'], obsName: 'obsCinturones' },
    { label: 'Volante/Tablero', name: 'estadoVolanteTablero', options: ['BUENO', 'REGULAR', 'MALO'], obsName: 'obsVolanteTablero' },
    { label: 'Bolsas de Aire', name: 'estadoBolsasAire', options: ['PRESENTES', 'DESPLEGADAS', 'AUSENTES'], obsName: 'obsBolsasAire' }
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
        <Armchair size={18} className="text-(--color-primary)" />
        Interior
      </h4>
      <div className="space-y-4 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
        {interiorFields.map((item) => (
          <div key={item.name} className="py-2 border-b border-gray-200 last:border-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
            <select 
              name={item.name} 
              value={formData[item.name]} 
              onChange={onChange} 
              className={getInputClass(item.name)}
            >
              <option value="">Seleccionar...</option>
              {item.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            {(formData[item.name] === 'MALO' || formData[item.name] === 'INCOMPLETOS' || formData[item.name] === 'DESPLEGADAS' || formData[item.name] === 'AUSENTES') && (
              <input
                type="text"
                name={item.obsName}
                value={formData[item.obsName]}
                onChange={onChange}
                placeholder="Observaciones..."
                className={`${getInputClass(item.obsName)} mt-1 h-9 py-1!`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteriorSection;
