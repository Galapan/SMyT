import { Armchair } from 'lucide-react';

const InteriorSection = ({ formData, errors, onChange, getInputClass, isCampoEditable }) => {
  // Verificar si los campos son editables
  const editable = {
    estadoAsientos: isCampoEditable ? isCampoEditable('estadoAsientos') : true,
    obsAsientos: isCampoEditable ? isCampoEditable('obsAsientos') : true,
    estadoCinturones: isCampoEditable ? isCampoEditable('estadoCinturones') : true,
    obsCinturones: isCampoEditable ? isCampoEditable('obsCinturones') : true,
    estadoVolanteTablero: isCampoEditable ? isCampoEditable('estadoVolanteTablero') : true,
    obsVolanteTablero: isCampoEditable ? isCampoEditable('obsVolanteTablero') : true,
    estadoBolsasAire: isCampoEditable ? isCampoEditable('estadoBolsasAire') : true,
    obsBolsasAire: isCampoEditable ? isCampoEditable('obsBolsasAire') : true
  };

  const interiorFields = [
    { label: 'Asientos', name: 'estadoAsientos', options: ['BUENO', 'REGULAR', 'MALO'], obsName: 'obsAsientos' },
    { label: 'Cinturones', name: 'estadoCinturones', options: ['COMPLETOS', 'INCOMPLETOS'], obsName: 'obsCinturones' },
    { label: 'Volante/Tablero', name: 'estadoVolanteTablero', options: ['BUENO', 'REGULAR', 'MALO'], obsName: 'obsVolanteTablero' },
    { label: 'Bolsas de Aire', name: 'estadoBolsasAire', options: ['PRESENTES', 'DESPLEGADAS', 'AUSENTES'], obsName: 'obsBolsasAire' }
  ];

  const getSelectClass = (status, fieldName) => {
    const base = "w-full h-10 px-3 border rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all text-sm";
    if (!editable[fieldName]) return `${base} bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed`;
    if (errors[fieldName]) return `${base} bg-white border-gob-rosa text-gray-900`;
    if (!status) return `${base} bg-white border-gray-200 text-gray-500`;
    return `${base} bg-white border-gray-200 text-gray-900`;
  };

  const getObservationClass = (fieldName) => {
    const base = "w-full text-sm border focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 rounded-lg py-2 px-3 transition-all placeholder-gray-400";
    if (!editable[fieldName]) return `${base} bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed`;
    if (errors[fieldName]) return `${base} border-gob-rosa bg-gob-rosa/10 text-gob-rosa`;
    return `${base} border-gray-200 bg-white text-gray-700`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <Armchair size={20} className="text-gray-700" />
        <h4 className="font-semibold text-gray-800">Interior y Seguridad</h4>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {interiorFields.map((item) => (
            <div key={item.name} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor={item.name} className="text-sm font-semibold text-gray-700">{item.label}</label>
              </div>
              
              <div className="relative">
                 <select
                  id={item.name}
                  name={item.name}
                  value={formData[item.name]}
                  onChange={onChange}
                  disabled={!editable[item.name]}
                  className={getSelectClass(formData[item.name], item.name)}
                >
                  <option value="">Seleccionar...</option>
                  {item.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              {errors[item.name] && <span className="text-xs text-gob-rosa font-medium">{errors[item.name]}</span>}

              {(formData[item.name] === 'MALO' || formData[item.name] === 'INCOMPLETOS' || formData[item.name] === 'DESPLEGADAS' || formData[item.name] === 'AUSENTES') && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200 mt-1">
                    <input
                        type="text"
                        name={item.obsName}
                        value={formData[item.obsName]}
                        onChange={onChange}
                        disabled={!editable[item.obsName]}
                        placeholder={`Observaciones sobre ${item.label.toLowerCase()}...`}
                        className={getObservationClass(item.obsName)}
                    />
                    {errors[item.obsName] && <span className="text-xs text-gob-rosa font-medium mt-1 block">{errors[item.obsName]}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteriorSection;
