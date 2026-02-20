import { Armchair } from 'lucide-react';

const InteriorSection = ({ formData, errors, onChange, getInputClass }) => {
  const interiorFields = [
    { label: 'Asientos', name: 'estadoAsientos', options: ['BUENO', 'REGULAR', 'MALO'], obsName: 'obsAsientos' },
    { label: 'Cinturones', name: 'estadoCinturones', options: ['COMPLETOS', 'INCOMPLETOS'], obsName: 'obsCinturones' },
    { label: 'Volante/Tablero', name: 'estadoVolanteTablero', options: ['BUENO', 'REGULAR', 'MALO'], obsName: 'obsVolanteTablero' },
    { label: 'Bolsas de Aire', name: 'estadoBolsasAire', options: ['PRESENTES', 'DESPLEGADAS', 'AUSENTES'], obsName: 'obsBolsasAire' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'BUENO': case 'COMPLETOS': case 'PRESENTES': return 'bg-green-50 text-green-700 border-green-200';
      case 'REGULAR': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'MALO': case 'INCOMPLETOS': case 'DESPLEGADAS': case 'AUSENTES': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-white text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Armchair size={20} className="text-(--color-primary)" />
        </div>
        <h4 className="font-bold text-gray-800 text-lg">Interior y Seguridad</h4>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {interiorFields.map((item) => (
            <div key={item.name} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">{item.label}</label>
                {formData[item.name] && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    getStatusColor(formData[item.name]).replace('bg-white', 'bg-gray-100')
                  }`}>
                    {formData[item.name]}
                  </span>
                )}
              </div>
              
              <div className="relative">
                 <select 
                  name={item.name} 
                  value={formData[item.name]} 
                  onChange={onChange} 
                  className={`w-full h-11 px-4 rounded-xl border-2 appearance-none focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all cursor-pointer font-medium text-sm ${getStatusColor(formData[item.name])}`}
                >
                  <option value="">Seleccionar estado...</option>
                  {item.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              {(formData[item.name] === 'MALO' || formData[item.name] === 'INCOMPLETOS' || formData[item.name] === 'DESPLEGADAS' || formData[item.name] === 'AUSENTES') && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <input
                        type="text"
                        name={item.obsName}
                        value={formData[item.obsName]}
                        onChange={onChange}
                        placeholder={`Observaciones sobre ${item.label.toLowerCase()}...`}
                        className="w-full text-sm border-b-2 border-red-200 focus:border-red-400 focus:outline-none py-2 px-1 bg-red-50/30 placeholder-red-300 text-red-700"
                    />
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
