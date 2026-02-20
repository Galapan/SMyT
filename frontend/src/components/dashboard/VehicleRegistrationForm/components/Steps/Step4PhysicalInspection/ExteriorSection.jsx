import FormSelect from '../../FormFields/FormSelect';
import FormInput from '../../FormFields/FormInput';
import ConditionalTextarea from '../../FormFields/ConditionalTextarea';
import { Truck } from 'lucide-react';

const ExteriorSection = ({ formData, errors, onChange, onKeyDown, getInputClass }) => {
  const exteriorFields = [
    { label: 'Estado Carrocería', name: 'estadoCarroceria', options: ['BUENO', 'REGULAR', 'MALO'] },
    { label: 'Cristales', name: 'estadoCristales', options: ['COMPLETOS', 'INCOMPLETOS', 'DAÑADOS'], obsName: 'obsCristales' },
    { label: 'Espejos', name: 'estadoEspejos', options: ['COMPLETOS', 'INCOMPLETOS'], obsName: 'obsEspejos' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'BUENO': case 'COMPLETOS': case 'NUEVAS': return 'bg-green-100 text-green-700 border-green-200';
      case 'REGULAR': case 'MEDIA_VIDA': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'MALO': case 'DAÑADOS': case 'INCOMPLETOS': case 'LISAS': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Truck size={20} className="text-(--color-primary)" />
          </div>
          <h4 className="font-bold text-gray-800 text-lg">Exterior y Carrocería</h4>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {exteriorFields.map((item) => (
            <div key={item.name} className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">{item.label}</label>
              <div className="relative">
                <select
                  name={item.name}
                  value={formData[item.name]}
                  onChange={onChange}
                  className={`w-full h-11 px-4 rounded-xl border-2 appearance-none focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all cursor-pointer font-medium ${getStatusColor(formData[item.name])} ${errors[item.name] ? 'border-red-300' : 'border-current'}`}
                >
                  <option value="">Seleccionar estado...</option>
                  {item.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              
              {(formData[item.name] === 'DAÑADOS' || formData[item.name] === 'INCOMPLETOS' || formData[item.name] === 'MALO') && item.obsName && (
                 <ConditionalTextarea
                  name={item.obsName}
                  value={formData[item.obsName]}
                  onChange={onChange}
                  error={errors[item.obsName]}
                  placeholder={`Detalles sobre ${item.label.toLowerCase()}...`}
                  rows={2}
                  className="mt-2 text-sm"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Llantas - Diseño Visual */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-(--color-primary)"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 1 0 10 10"/></svg>
                </div>
                <h4 className="font-bold text-gray-800 text-lg">Neumáticos</h4>
            </div>
            <div className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                Revisión por eje
            </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Eje Delantero */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-5 border-2 border-dashed border-blue-200 rounded-2xl hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between mb-4">
                 <p className="text-sm font-bold text-blue-800 uppercase tracking-wider">Eje Delantero</p>
                 <span className="text-xs text-blue-600 font-medium">Frontal</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Cantidad</label>
                  <input 
                    type="number" 
                    name="cantLlantasDelanteras" 
                    value={formData.cantLlantasDelanteras} 
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors font-medium text-center"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Condición</label>
                   <div className="relative">
                        <select 
                            name="estadoLlantasDelanteras" 
                            value={formData.estadoLlantasDelanteras} 
                            onChange={onChange}
                            className={`w-full h-10 px-3 pr-8 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm ${getStatusColor(formData.estadoLlantasDelanteras)}`}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="NUEVAS">Nuevas</option>
                            <option value="MEDIA_VIDA">Media Vida</option>
                            <option value="LISAS">Lisas/Dañadas</option>
                        </select>
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Eje Trasero */}
          <div className="relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
             <div className="relative p-5 border-2 border-dashed border-gray-300 rounded-2xl hover:border-gray-400 transition-colors">
              <div className="flex items-center justify-between mb-4">
                 <p className="text-sm font-bold text-gray-800 uppercase tracking-wider">Eje Trasero</p>
                 <span className="text-xs text-gray-500 font-medium">Posterior</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Cantidad</label>
                  <input 
                    type="number" 
                    name="cantLlantasTraseras" 
                    value={formData.cantLlantasTraseras} 
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors font-medium text-center"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Condición</label>
                   <div className="relative">
                        <select 
                            name="estadoLlantasTraseras" 
                            value={formData.estadoLlantasTraseras} 
                            onChange={onChange}
                            className={`w-full h-10 px-3 pr-8 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all font-medium text-sm ${getStatusColor(formData.estadoLlantasTraseras)}`}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="NUEVAS">Nuevas</option>
                            <option value="MEDIA_VIDA">Media Vida</option>
                            <option value="LISAS">Lisas/Dañadas</option>
                        </select>
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExteriorSection;
