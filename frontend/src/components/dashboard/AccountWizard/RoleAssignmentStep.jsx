const RoleAssignmentStep = ({ formData, errors, depositos, onChange }) => {
  const activeUser = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user'));
  const isSuperAdmin = activeUser?.rol === 'SUPER_USUARIO';

  const getInputClass = (fieldName) => `
    w-full px-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none transition-all text-sm
    ${errors[fieldName] ? 'border-(--color-rosa) bg-(--color-rosa)/5 focus:ring-(--color-rosa)' : 'border-gray-300'}
  `;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Asignación de Roles y Permisos</h3>

      <div className="space-y-6">
        <div>
          <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">Rol del Usuario *</label>
          <select
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={onChange}
            className={getInputClass('rol')}
          >
            <option value="">Seleccione un rol...</option>
            {isSuperAdmin && <option value="SUPER_USUARIO">Super usuario</option>}
            {isSuperAdmin && <option value="ADMINISTRADOR">Administrador</option>}
            <option value="ADMINISTRADOR_CONCESIONARIO">Administrador concesionario</option>
          </select>
          {errors.rol && <p className="text-(--color-rosa) text-xs mt-1">{errors.rol}</p>}
        </div>

        {formData.rol === 'ADMINISTRADOR_CONCESIONARIO' && (
          <div>
            <label htmlFor="depositoId" className="block text-sm font-medium text-gray-700 mb-1">
              Asignar a Depósito Vehicular <span className="text-gray-400 font-normal">(Opcional)</span>
            </label>
            <select
              id="depositoId"
              name="depositoId"
              value={formData.depositoId}
              onChange={onChange}
              className={getInputClass('depositoId')}
            >
              <option value="">Seleccione un depósito...</option>
              {depositos.map(deposito => (
                <option key={deposito.id} value={deposito.id}>
                  {deposito.nombre} - {deposito.municipio}
                </option>
              ))}
            </select>
            {errors.depositoId && <p className="text-(--color-rosa) text-xs mt-1">{errors.depositoId}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleAssignmentStep;
