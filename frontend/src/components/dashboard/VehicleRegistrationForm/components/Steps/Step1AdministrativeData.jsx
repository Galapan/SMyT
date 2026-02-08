import FormInput from '../FormFields/FormInput';
import { Upload } from 'lucide-react';

const Step1AdministrativeData = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-(--color-primary) mb-4">
        Paso 1: Datos Administrativos
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Folio de Proceso *"
          name="folioProceso"
          value={formData.folioProceso}
          onChange={onChange}
          error={errors.folioProceso}
          placeholder="Ej. SMT-2026-001234"
          helperText="Folio único de identificación del proceso"
        />
        <FormInput
          label="Fecha de Ingreso *"
          name="fechaIngreso"
          type="date"
          value={formData.fechaIngreso}
          onChange={onChange}
          error={errors.fechaIngreso}
        />
      </div>

      <FormInput
        label="Autoridad Responsable *"
        name="autoridad"
        value={formData.autoridad}
        onChange={onChange}
        error={errors.autoridad}
        placeholder="Ej. Fiscalía General del Estado de Tlaxcala"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Documentos Adjuntos</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-(--color-primary) transition-colors cursor-pointer">
          <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
          <p className="text-sm text-gray-600">Haz clic para cargar archivos o arrástralos aquí</p>
          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOC (máx. 10MB cada uno)</p>
        </div>
      </div>
    </div>
  );
};

export default Step1AdministrativeData;
