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

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
        <Truck size={18} className="text-(--color-primary)" />
        Exterior y Neumáticos
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exteriorFields.map((item) => (
          <div key={item.name} className="space-y-2">
            <FormSelect
              label={item.label}
              name={item.name}
              value={formData[item.name]}
              onChange={onChange}
              error={errors[item.name]}
              options={item.options}
            />
            {(formData[item.name] === 'DAÑADOS' || formData[item.name] === 'INCOMPLETOS' || formData[item.name] === 'MALO') && item.obsName && (
              <ConditionalTextarea
                name={item.obsName}
                value={formData[item.obsName]}
                onChange={onChange}
                error={errors[item.obsName]}
                placeholder={`Describa el daño en ${item.label.toLowerCase()}...`}
                rows={2}
              />
            )}
          </div>
        ))}
      </div>

      {/* Llantas - Refactorizado por eje */}
      <div className="mt-6 border-t pt-4">
        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Detalle de Neumáticos</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Eje Delantero */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-xs font-bold text-(--color-primary) mb-3">EJE DELANTERO</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Cantidad</label>
                <input 
                  type="number" 
                  name="cantLlantasDelanteras" 
                  value={formData.cantLlantasDelanteras} 
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  className={getInputClass('cantLlantasDelanteras')}
                  min="0"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Condición</label>
                <select 
                  name="estadoLlantasDelanteras" 
                  value={formData.estadoLlantasDelanteras} 
                  onChange={onChange}
                  className={getInputClass('estadoLlantasDelanteras')}
                >
                  <option value="">Estado...</option>
                  <option value="NUEVAS">Nuevas</option>
                  <option value="MEDIA_VIDA">Media Vida</option>
                  <option value="LISAS">Lisas/Dañadas</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Eje Trasero */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-xs font-bold text-(--color-primary) mb-3">EJE TRASERO</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Cantidad</label>
                <input 
                  type="number" 
                  name="cantLlantasTraseras" 
                  value={formData.cantLlantasTraseras} 
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  className={getInputClass('cantLlantasTraseras')}
                  min="0"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Condición</label>
                <select 
                  name="estadoLlantasTraseras" 
                  value={formData.estadoLlantasTraseras} 
                  onChange={onChange}
                  className={getInputClass('estadoLlantasTraseras')}
                >
                  <option value="">Estado...</option>
                  <option value="NUEVAS">Nuevas</option>
                  <option value="MEDIA_VIDA">Media Vida</option>
                  <option value="LISAS">Lisas/Dañadas</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExteriorSection;
