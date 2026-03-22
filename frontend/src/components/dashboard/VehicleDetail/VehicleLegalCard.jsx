import { ShieldAlert } from 'lucide-react';
import dayjs from 'dayjs';

/**
 * Tarjeta de situación legal del vehículo
 */
export default function VehicleLegalCard({ vehiculo }) {
  const estatusStyle = getEstatusStyle(vehiculo.estatusLegal);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-1">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">Situación Legal</h3>
        </div>
        {estatusStyle && (
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${estatusStyle.color}`}>
            {estatusStyle.label}
          </span>
        )}
      </div>
      <div className="p-5 space-y-1">
        <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Autoridad Remitente</p>
          <p className="text-sm font-semibold text-gray-900">{vehiculo.autoridad}</p>
        </div>
        <DataRow label="¿Tiene Acta de Baja?" value={vehiculo.tieneActaBaja ? 'Sí' : 'No'} />
        <DataRow label="No. de Oficio" value={vehiculo.noOficio} />
        <DataRow label="Fecha Acta de Baja" value={vehiculo.fechaActaBaja ? dayjs(vehiculo.fechaActaBaja).format('DD MMM YYYY') : null} />
        <DataRow label="¿Tiene Título/Factura?" value={vehiculo.tieneTituloFactura ? 'Sí' : 'No'} />
      </div>
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">
        {value || 'N/A'}
      </span>
    </div>
  );
}

/**
 * Función pura para obtener estilo visual del estatus legal
 */
function getEstatusStyle(estatus) {
  if (!estatus) return null;
  
  switch (estatus) {
    case 'ROBADO': return { label: estatus, color: 'text-red-700 bg-red-50 border-red-200' };
    case 'DECOMISADO': return { label: estatus, color: 'text-orange-700 bg-orange-50 border-orange-200' };
    case 'SINIESTRADO': return { label: estatus, color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
    default: return { label: estatus, color: 'text-gray-700 bg-gray-100 border-gray-200' };
  }
}
