import FormSelect from '../FormFields/FormSelect';
import FormCheckbox from '../FormFields/FormCheckbox';
import FormInput from '../FormFields/FormInput';

const Step3LegalStatus = ({ formData, errors, onChange, isCampoEditable }) => {
  // Verificar si los campos son editables
  const editable = {
    estatusLegal: isCampoEditable ? isCampoEditable('estatusLegal') : true,
    tieneActaBaja: isCampoEditable ? isCampoEditable('tieneActaBaja') : true,
    noOficio: isCampoEditable ? isCampoEditable('noOficio') : true,
    fechaActaBaja: isCampoEditable ? isCampoEditable('fechaActaBaja') : true,
    tieneTituloFactura: isCampoEditable ? isCampoEditable('tieneTituloFactura') : true
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-(--color-primary) mb-4">
        Paso 3: Estatus Legal
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Estatus Legal *"
          name="estatusLegal"
          value={formData.estatusLegal}
          onChange={onChange}
          error={errors.estatusLegal}
          options={[
            { value: 'ROBADO', label: 'Robado' },
            { value: 'DECOMISADO', label: 'Decomisado' },
            { value: 'OBSOLETO', label: 'Obsoleto' },
            { value: 'SINIESTRADO', label: 'Siniestrado' }
          ]}
          disabled={!editable.estatusLegal}
        />
        <FormCheckbox
          label="Tiene Acta de Baja"
          name="tieneActaBaja"
          checked={formData.tieneActaBaja}
          onChange={onChange}
          className="pt-6"
          disabled={!editable.tieneActaBaja}
        />
      </div>

      {formData.tieneActaBaja && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg animate-fade-in">
          <FormInput
            label="Número de Oficio *"
            name="noOficio"
            value={formData.noOficio}
            onChange={onChange}
            error={errors.noOficio}
            placeholder="Ej. OF-2026-0001"
            disabled={!editable.noOficio}
          />
          <FormInput
            label="Fecha de Acta de Baja *"
            name="fechaActaBaja"
            type="date"
            value={formData.fechaActaBaja}
            onChange={onChange}
            error={errors.fechaActaBaja}
            disabled={!editable.fechaActaBaja}
          />
        </div>
      )}

      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
        <FormCheckbox
          label="Tiene Título/Factura Original"
          name="tieneTituloFactura"
          checked={formData.tieneTituloFactura}
          onChange={onChange}
          disabled={!editable.tieneTituloFactura}
        />
      </div>
    </div>
  );
};

export default Step3LegalStatus;
