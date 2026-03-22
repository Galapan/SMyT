import FormInput from '../FormFields/FormInput';
import FormSelect from '../FormFields/FormSelect';

const Step2VehicleData = ({ formData, errors, onChange, onKeyDown, duplicateFields, validatingFields, isCampoEditable }) => {
  // Verificar si los campos son editables
  const editable = {
    noInventario: isCampoEditable ? isCampoEditable('noInventario') : true,
    marcaTipo: isCampoEditable ? isCampoEditable('marcaTipo') : true,
    anio: isCampoEditable ? isCampoEditable('anio') : true,
    tipoServicio: isCampoEditable ? isCampoEditable('tipoServicio') : true,
    vin: isCampoEditable ? isCampoEditable('vin') : true,
    placa: isCampoEditable ? isCampoEditable('placa') : true,
    noMotor: isCampoEditable ? isCampoEditable('noMotor') : true,
    colorOriginal: isCampoEditable ? isCampoEditable('colorOriginal') : true,
    colorActual: isCampoEditable ? isCampoEditable('colorActual') : true,
    odometro: isCampoEditable ? isCampoEditable('odometro') : true
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-(--color-primary) mb-4">
        Paso 2: Datos del Vehículo
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="No. Inventario *"
          name="noInventario"
          value={formData.noInventario}
          onChange={onChange}
          error={errors.noInventario}
          isDuplicate={duplicateFields?.noInventario}
          isValidating={validatingFields?.noInventario}
          placeholder="Ej. INV-2026-0001"
          disabled={!editable.noInventario}
        />
        <FormInput
          label="Marca/Tipo *"
          name="marcaTipo"
          value={formData.marcaTipo}
          onChange={onChange}
          error={errors.marcaTipo}
          placeholder="Ej. Toyota Corolla"
          disabled={!editable.marcaTipo}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Año *"
          name="anio"
          type="number"
          value={formData.anio}
          onChange={onChange}
          onKeyDown={onKeyDown}
          error={errors.anio}
          placeholder="Ej. 2020"
          min="1900"
          max="2030"
          disabled={!editable.anio}
        />
        <FormSelect
          label="Tipo de Servicio *"
          name="tipoServicio"
          value={formData.tipoServicio}
          onChange={onChange}
          error={errors.tipoServicio}
          options={[
            { value: 'PARTICULAR', label: 'Particular' },
            { value: 'PUBLICO', label: 'Público' }
          ]}
          disabled={!editable.tipoServicio}
        />
      </div>

      <FormInput
        label="VIN (Número de Identificación Vehicular) *"
        name="vin"
        value={formData.vin}
        onChange={onChange}
        error={errors.vin}
        isDuplicate={duplicateFields?.vin}
        isValidating={validatingFields?.vin}
        placeholder="17 caracteres alfanuméricos"
        maxLength={17}
        helperText={`${formData.vin.length}/17 caracteres`}
        disabled={!editable.vin}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Placas *"
          name="placa"
          value={formData.placa}
          onChange={onChange}
          error={errors.placa}
          isDuplicate={duplicateFields?.placa}
          isValidating={validatingFields?.placa}
          placeholder="Ej. ABC-123-D"
          disabled={!editable.placa}
        />
        <FormInput
          label="No. Motor *"
          name="noMotor"
          value={formData.noMotor}
          onChange={onChange}
          error={errors.noMotor}
          isDuplicate={duplicateFields?.noMotor}
          isValidating={validatingFields?.noMotor}
          placeholder="Número de motor"
          disabled={!editable.noMotor}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Color Original *"
          name="colorOriginal"
          value={formData.colorOriginal}
          onChange={onChange}
          error={errors.colorOriginal}
          placeholder="Ej. Blanco"
          disabled={!editable.colorOriginal}
        />
        <FormInput
          label="Color Actual *"
          name="colorActual"
          value={formData.colorActual}
          onChange={onChange}
          error={errors.colorActual}
          placeholder="Ej. Blanco"
          disabled={!editable.colorActual}
        />
      </div>

      <FormInput
        label="Odómetro (km) *"
        name="odometro"
        type="number"
        value={formData.odometro}
        onChange={onChange}
        onKeyDown={onKeyDown}
        error={errors.odometro}
        placeholder="Ej. 85000"
        min="0"
        disabled={!editable.odometro}
      />
    </div>
  );
};

export default Step2VehicleData;
