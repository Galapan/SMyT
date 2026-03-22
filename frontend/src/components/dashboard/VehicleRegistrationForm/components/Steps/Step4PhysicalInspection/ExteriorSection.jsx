import FormSelect from '../../FormFields/FormSelect';
import FormInput from '../../FormFields/FormInput';
import ConditionalTextarea from '../../FormFields/ConditionalTextarea';
import { Truck } from 'lucide-react';

const ExteriorSection = ({ formData, errors, onChange, onKeyDown, getInputClass, isCampoEditable }) => {
  // Verificar si los campos son editables
  const editable = {
    estadoCarroceria: isCampoEditable ? isCampoEditable('estadoCarroceria') : true,
    estadoCristales: isCampoEditable ? isCampoEditable('estadoCristales') : true,
    obsCristales: isCampoEditable ? isCampoEditable('obsCristales') : true,
    estadoEspejos: isCampoEditable ? isCampoEditable('estadoEspejos') : true,
    obsEspejos: isCampoEditable ? isCampoEditable('obsEspejos') : true,
    cantLlantasDelanteras: isCampoEditable ? isCampoEditable('cantLlantasDelanteras') : true,
    estadoLlantasDelanteras: isCampoEditable ? isCampoEditable('estadoLlantasDelanteras') : true,
    cantLlantasTraseras: isCampoEditable ? isCampoEditable('cantLlantasTraseras') : true,
    estadoLlantasTraseras: isCampoEditable ? isCampoEditable('estadoLlantasTraseras') : true
  };

  const exteriorFields = [
    { label: 'Estado Carrocería', name: 'estadoCarroceria', options: ['BUENO', 'REGULAR', 'MALO'] },
    { label: 'Cristales', name: 'estadoCristales', options: ['COMPLETOS', 'INCOMPLETOS', 'DAÑADOS'], obsName: 'obsCristales' },
    { label: 'Espejos', name: 'estadoEspejos', options: ['COMPLETOS', 'INCOMPLETOS'], obsName: 'obsEspejos' }
  ];

  const getSelectClass = (status, fieldName) => {
    const base = "w-full h-10 px-3 border rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all text-sm";
    if (!editable[fieldName]) return `${base} bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed`;
    if (errors[fieldName]) return `${base} bg-white border-gob-rosa text-gray-900`;
    if (!status) return `${base} bg-white border-gray-200 text-gray-500`;
    return `${base} bg-white border-gray-200 text-gray-900`;
  };

  const getNumberInputClass = (fieldName) => {
    const base = "w-full h-10 px-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors text-sm";
    if (!editable[fieldName]) return `${base} bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed`;
    if (errors[fieldName]) return `${base} bg-white border-gob-rosa`;
    return `${base} bg-white border-gray-300`;
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
              <label htmlFor={item.name} className="block text-sm font-semibold text-gray-700">{item.label}</label>
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

              {(formData[item.name] === 'DAÑADOS' || formData[item.name] === 'INCOMPLETOS' || formData[item.name] === 'MALO') && item.obsName && (
                 <ConditionalTextarea
                  name={item.obsName}
                  value={formData[item.obsName]}
                  onChange={onChange}
                  error={errors[item.obsName]}
                  placeholder={`Detalles sobre ${item.label.toLowerCase()}...`}
                  rows={2}
                  className="mt-2 text-sm"
                  disabled={!editable[item.obsName]}
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
            <div className={`p-5 border rounded-xl transition-colors ${errors.cantLlantasDelanteras || errors.estadoLlantasDelanteras ? 'border-gob-rosa' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                 <p className="text-sm font-semibold text-gray-800">Eje Delantero</p>
                 <span className="text-xs text-gray-500">Frontal</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="cantLlantasDelanteras" className="text-xs font-semibold text-gray-600 mb-1 block">Cantidad (Máx. 2)</label>
                  <input
                    id="cantLlantasDelanteras"
                    type="number"
                    name="cantLlantasDelanteras"
                    value={formData.cantLlantasDelanteras}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    disabled={!editable.cantLlantasDelanteras}
                    className={getNumberInputClass('cantLlantasDelanteras')}
                    min="0"
                    max="2"
                  />
                </div>
                <div>
                  <label htmlFor="estadoLlantasDelanteras" className="text-xs font-semibold text-gray-600 mb-1 block">Condición</label>
                   <div className="relative">
                        <select
                            id="estadoLlantasDelanteras"
                            name="estadoLlantasDelanteras"
                            value={formData.estadoLlantasDelanteras}
                            onChange={onChange}
                            disabled={!editable.estadoLlantasDelanteras}
                            className={getSelectClass(formData.estadoLlantasDelanteras, 'estadoLlantasDelanteras')}
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
                   {errors.estadoLlantasDelanteras && <span className="text-xs text-gob-rosa font-medium mt-1 block">{errors.estadoLlantasDelanteras}</span>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Eje Trasero */}
          <div className="relative">
             <div className={`p-5 border rounded-xl transition-colors ${errors.cantLlantasTraseras || errors.estadoLlantasTraseras ? 'border-gob-rosa' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                 <p className="text-sm font-semibold text-gray-800">Eje Trasero</p>
                 <span className="text-xs text-gray-500">Posterior</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="cantLlantasTraseras" className="text-xs font-semibold text-gray-600 mb-1 block">Cantidad (Máx. 2)</label>
                  <input
                    id="cantLlantasTraseras"
                    type="number"
                    name="cantLlantasTraseras"
                    value={formData.cantLlantasTraseras}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    disabled={!editable.cantLlantasTraseras}
                    className={getNumberInputClass('cantLlantasTraseras')}
                    min="0"
                    max="2"
                  />
                </div>
                <div>
                  <label htmlFor="estadoLlantasTraseras" className="text-xs font-semibold text-gray-600 mb-1 block">Condición</label>
                   <div className="relative">
                        <select
                            id="estadoLlantasTraseras"
                            name="estadoLlantasTraseras"
                            value={formData.estadoLlantasTraseras}
                            onChange={onChange}
                            disabled={!editable.estadoLlantasTraseras}
                            className={getSelectClass(formData.estadoLlantasTraseras, 'estadoLlantasTraseras')}
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
                   {errors.estadoLlantasTraseras && <span className="text-xs text-gob-rosa font-medium mt-1 block">{errors.estadoLlantasTraseras}</span>}
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
