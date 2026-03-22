import { Car } from 'lucide-react';

/**
 * Tarjeta de identidad del vehículo
 */
export default function VehicleIdentityCard({ vehiculo }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-1">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Car size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">Identidad del Vehículo</h3>
        </div>
      </div>
      <div className="p-5 space-y-1">
        <DataRow label="Marca/Línea" value={vehiculo.marcaTipo} />
        <DataRow label="Modelo (Año)" value={vehiculo.anio} />
        <DataRow label="Placas" value={vehiculo.placa} isHighlight />
        <DataRow label="Número de VIN" value={vehiculo.vin} isHighlight />
        <DataRow label="Motor" value={vehiculo.noMotor} />
        <DataRow label="Color Original" value={vehiculo.colorOriginal} />
        <DataRow label="Color Actual" value={vehiculo.colorActual} />
        <DataRow label="Odómetro" value={`${vehiculo.odometro} km`} />
        <DataRow label="Tipo Servicio" value={vehiculo.tipoServicio} />
      </div>
    </div>
  );
}

function DataRow({ label, value, isHighlight }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium ${isHighlight ? 'text-gray-900 font-bold bg-gray-100 px-2 py-0.5 rounded border border-gray-200' : 'text-gray-900'}`}>
        {value || 'N/A'}
      </span>
    </div>
  );
}
