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

  const getStatusColor = (status, fieldName) => {
    if (errors[fieldName]) return 'border-red-500';
    if (!status) return 'border-gray-200 text-gray-500';
    return 'border-gray-200 text-gray-900';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Truck size={20} className="text-gray-700" />
          <h4 className="font-semibold text-gray-800">Exterior y Carrocería</h4>
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
                  className={`w-full h-10 px-3 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all text-sm ${getStatusColor(formData[item.name], item.name)}`}
                >
                  <option value="">Seleccionar...</option>
                  {item.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              {errors[item.name] && <span className="text-xs text-red-500 font-medium">{errors[item.name]}</span>}
              
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
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 1 0 10 10"/></svg>
                <h4 className="font-semibold text-gray-800">Neumáticos</h4>
            </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Eje Delantero */}
          <div className="relative">
            <div className={`p-5 border rounded-xl transition-colors ${errors.cantLlantasDelanteras || errors.estadoLlantasDelanteras ? 'border-red-300' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                 <p className="text-sm font-semibold text-gray-800">Eje Delantero</p>
                 <span className="text-xs text-gray-500">Frontal</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Cantidad (Máx. 2)</label>
                  <input 
                    type="number" 
                    name="cantLlantasDelanteras" 
                    value={formData.cantLlantasDelanteras} 
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    className={`w-full h-10 px-3 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors text-sm ${errors.cantLlantasDelanteras ? 'border-red-500' : 'border-gray-300'}`}
                    min="0"
                    max="2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Condición</label>
                   <div className="relative">
                        <select 
                            name="estadoLlantasDelanteras" 
                            value={formData.estadoLlantasDelanteras} 
                            onChange={onChange}
                            className={`w-full h-10 px-3 pr-8 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all text-sm ${getStatusColor(formData.estadoLlantasDelanteras, 'estadoLlantasDelanteras')}`}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="NUEVAS">Nuevas</option>
                            <option value="MEDIA_VIDA">Media Vida</option>
                            <option value="LISAS">Lisas/Dañadas</option>
                        </select>
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                   </div>
                   {errors.estadoLlantasDelanteras && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.estadoLlantasDelanteras}</span>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Eje Trasero */}
          <div className="relative">
             <div className={`p-5 border rounded-xl transition-colors ${errors.cantLlantasTraseras || errors.estadoLlantasTraseras ? 'border-red-300' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                 <p className="text-sm font-semibold text-gray-800">Eje Trasero</p>
                 <span className="text-xs text-gray-500">Posterior</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Cantidad (Máx. 2)</label>
                  <input 
                    type="number" 
                    name="cantLlantasTraseras" 
                    value={formData.cantLlantasTraseras} 
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    className={`w-full h-10 px-3 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors text-sm ${errors.cantLlantasTraseras ? 'border-red-500' : 'border-gray-300'}`}
                    min="0"
                    max="2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Condición</label>
                   <div className="relative">
                        <select 
                            name="estadoLlantasTraseras" 
                            value={formData.estadoLlantasTraseras} 
                            onChange={onChange}
                            className={`w-full h-10 px-3 pr-8 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all text-sm ${getStatusColor(formData.estadoLlantasTraseras, 'estadoLlantasTraseras')}`}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="NUEVAS">Nuevas</option>
                            <option value="MEDIA_VIDA">Media Vida</option>
                            <option value="LISAS">Lisas/Dañadas</option>
                        </select>
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                   </div>
                   {errors.estadoLlantasTraseras && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.estadoLlantasTraseras}</span>}
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
