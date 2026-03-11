import { MapPin } from 'lucide-react';
import TableSkeleton from '../common/TableSkeleton';

const EMPTY_DEPOTS = [];

const DepotTable = ({ loading = false, depots = EMPTY_DEPOTS }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
        <h3 className="font-bold text-gray-900">Depósitos Registrados</h3>
        <div className="flex space-x-2">
          {/* Filter options could go here */}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-white">
        {loading ? (
          <TableSkeleton rows={5} columns={4} />
        ) : depots.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No hay depósitos registrados.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <table className="w-full">
                <thead className="bg-gray-50/50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 backdrop-blur-sm">Nombre del Concesionario</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 backdrop-blur-sm">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 backdrop-blur-sm">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {depots.map((depot) => (
                <tr key={depot.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-(--color-secondary) shrink-0 flex items-center justify-center text-(--color-primary) font-bold text-lg">
                        {depot.nombre?.charAt(0) || 'D'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{depot.nombre}</div>
                        <div className="text-xs text-gray-500">ID: {depot.numero || depot.id.substring(0,4)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-1.5 text-gray-400" />
                      {depot.municipio}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      depot.activo 
                        ? 'bg-(--color-verde)/15 text-(--color-verde)' 
                        : 'bg-(--color-rosa)/15 text-(--color-rosa)'
                    }`}>
                      {depot.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
            </div>
            
            {/* Mobile Card View */}
            <div className="sm:hidden flex flex-col divide-y divide-gray-100">
              {depots.map((depot) => (
                <div key={depot.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-(--color-secondary) shrink-0 flex items-center justify-center text-(--color-primary) font-bold text-sm">
                        {depot.nombre?.charAt(0) || 'D'}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-semibold text-gray-900 line-clamp-1">{depot.nombre}</div>
                        <div className="text-xs text-gray-500">ID: {depot.numero || depot.id.substring(0,4)}</div>
                      </div>
                    </div>
                    <span className={`shrink-0 ml-2 px-2 py-0.5 inline-flex text-[10px] font-semibold rounded-full ${
                      depot.activo 
                        ? 'bg-(--color-verde)/15 text-(--color-verde)' 
                        : 'bg-(--color-rosa)/15 text-(--color-rosa)'
                    }`}>
                      {depot.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-600 mt-2 pl-11">
                    <MapPin size={14} className="mr-1.5 text-gray-400 shrink-0" />
                    <span className="truncate">{depot.municipio}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default DepotTable;
