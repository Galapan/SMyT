import { CheckCircle } from 'lucide-react';

const ConfirmationStep = ({ formData, depositos }) => {
  return (
    <div className="space-y-6 text-center py-2">
      <div className="mx-auto w-16 h-16 bg-(--color-verde)/15 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-(--color-verde)" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">Confirmar Creación</h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        Revisa que la información sea correcta antes de crear la cuenta.
        El usuario podrá iniciar sesión inmediatamente.
      </p>

      <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto mt-6 border border-gray-100">
        <div className="space-y-3">
          <p><span className="font-semibold text-gray-700">Nombre:</span> {formData.nombre} {formData.apellido}</p>
          <p><span className="font-semibold text-gray-700">Email:</span> {formData.email}</p>
          <p>
            <span className="font-semibold text-gray-700">Rol:</span>{' '}
            <span className="px-2 py-1 bg-(--color-primary)/10 text-(--color-primary) rounded-md text-sm font-medium">
              {formData.rol.replace('_', ' ')}
            </span>
          </p>
          {formData.rol === 'ADMINISTRADOR_CONCESIONARIO' && (
            <p>
              <span className="font-semibold text-gray-700">Depósito:</span>{' '}
              {formData.depositoId ? depositos.find(d => d.id === formData.depositoId)?.nombre : <span className="text-gray-400 italic">Sin asignar</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
