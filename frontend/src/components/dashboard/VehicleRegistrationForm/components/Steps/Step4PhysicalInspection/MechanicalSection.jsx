import FormSelect from '../../FormFields/FormSelect';
import { Cog } from 'lucide-react';

const MechanicalSection = ({ formData, errors, onChange, getInputClass }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
        <Cog size={18} className="text-(--color-primary)" />
        Mecánica
      </h4>
      <div className="space-y-4">
        <FormSelect
          label="Estado del Motor"
          name="estadoMotor"
          value={formData.estadoMotor}
          onChange={onChange}
          error={errors.estadoMotor}
          options={[
            { value: 'BUENO', label: 'Bueno / Completo' },
            { value: 'MALO', label: 'Malo / Incompleto' },
            { value: 'FALTANTE', label: 'Faltante' }
          ]}
        />
        
        <FormSelect
          label="Batería"
          name="estadoBateria"
          value={formData.estadoBateria}
          onChange={onChange}
          error={errors.estadoBateria}
          options={[
            { value: 'BUENO', label: 'Presente / Funciona' },
            { value: 'MALO', label: 'Dañada' },
            { value: 'FALTANTE', label: 'Faltante' }
          ]}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transmisión</label>
            <select 
              name="tipoTransmision" 
              value={formData.tipoTransmision} 
              onChange={onChange} 
              className={getInputClass('tipoTransmision')}
            >
              <option value="">Tipo...</option>
              <option value="MANUAL">Manual</option>
              <option value="AUTOMATICA">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frenos</label>
            <select 
              name="estadoFrenos" 
              value={formData.estadoFrenos} 
              onChange={onChange} 
              className={getInputClass('estadoFrenos')}
            >
              <option value="">Estado...</option>
              <option value="FUNCIONAL">Funcional</option>
              <option value="FALLA">Con Falla</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicalSection;
