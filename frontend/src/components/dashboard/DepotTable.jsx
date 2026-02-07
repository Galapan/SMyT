import { Edit2, Trash2, MapPin, MoreVertical } from 'lucide-react';

const DepotTable = () => {
  // Mock data - replace with real data later
  const depots = [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">Depósitos Registrados</h3>
        <div className="flex space-x-2">
          {/* Filter options could go here */}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre del Concesionario</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ubicación</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estatus</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {depots.map((depot) => (
              <tr key={depot.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-(--color-secondary) flex items-center justify-center text-(--color-primary) font-bold text-lg">
                      {depot.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">{depot.name}</div>
                      <div className="text-xs text-gray-500">ID: {depot.id.toString().padStart(4, '0')}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-1.5 text-gray-400" />
                    {depot.location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    depot.status === 'Activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {depot.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-(--color-primary) hover:bg-gray-100 rounded-md transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1.5 text-(--color-rosa) hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {/* Mobile fallback for actions always visible or different UI */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination (Visual only) */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end">
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Anterior</button>
          <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default DepotTable;
