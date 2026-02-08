import FormInput from '../FormFields/FormInput';
import FormSelect from '../FormFields/FormSelect';

const Step2VehicleData = ({ formData, errors, onChange, onKeyDown }) => {
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
          placeholder="Ej. INV-2026-0001"
        />
        <FormInput
          label="Marca/Tipo *"
          name="marcaTipo"
          value={formData.marcaTipo}
          onChange={onChange}
          error={errors.marcaTipo}
          placeholder="Ej. Toyota Corolla"
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
        />
      </div>

      <FormInput
        label="VIN (Número de Identificación Vehicular) *"
        name="vin"
        value={formData.vin}
        onChange={onChange}
        error={errors.vin}
        placeholder="17 caracteres alfanuméricos"
        maxLength={17}
        helperText={`${formData.vin.length}/17 caracteres`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Placas *"
          name="placa"
          value={formData.placa}
          onChange={onChange}
          error={errors.placa}
          placeholder="Ej. ABC-123-D"
        />
        <FormInput
          label="No. Motor *"
          name="noMotor"
          value={formData.noMotor}
          onChange={onChange}
          error={errors.noMotor}
          placeholder="Número de motor"
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
        />
        <FormInput
          label="Color Actual *"
          name="colorActual"
          value={formData.colorActual}
          onChange={onChange}
          error={errors.colorActual}
          placeholder="Ej. Blanco"
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
      />
    </div>
  );
};

export default Step2VehicleData;
