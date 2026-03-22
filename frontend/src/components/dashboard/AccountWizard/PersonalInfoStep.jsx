import FormInput from '../VehicleRegistrationForm/components/FormFields/FormInput';
import PasswordValidation from '../../common/PasswordValidation';

const PersonalInfoStep = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Nombre *"
          name="nombre"
          value={formData.nombre}
          onChange={onChange}
          error={errors.nombre}
          placeholder="Ej. Juan"
        />

        <FormInput
          label="Apellidos *"
          name="apellido"
          value={formData.apellido}
          onChange={onChange}
          error={errors.apellido}
          placeholder="Ej. Pérez"
        />

        <FormInput
          label="Correo Electrónico *"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          error={errors.email}
          placeholder="correo@ejemplo.com"
        />

        <FormInput
          label="Contraseña *"
          name="password"
          type="password"
          value={formData.password}
          onChange={onChange}
          error={errors.password}
          placeholder="••••••••"
        />
        <PasswordValidation password={formData.password} />
      </div>
    </div>
  );
};

export default PersonalInfoStep;
