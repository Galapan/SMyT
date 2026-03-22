import { Settings, CheckCircle2, AlertTriangle } from 'lucide-react';

/**
 * Tarjeta de inspección física del vehículo
 */
export default function VehicleInspectionCard({ vehiculo }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-1 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">Inspección de Hardware</h3>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
          <ConditionBox label="Carrocería" condition={vehiculo.estadoCarroceria} />
          <ConditionBox label="Cristales" condition={vehiculo.estadoCristales} />
          <ConditionBox label="Motor Intacto" condition={vehiculo.motorCompleto} />
          <ConditionBox label="Batería" condition={vehiculo.bateriaPresente} />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Observaciones del Inspector
          </p>
          <p className="text-sm text-gray-700 bg-yellow-50/50 p-3 rounded-xl border border-yellow-100 min-h-15">
            {vehiculo.observacionesInspector || 'Ninguna observación capturada durante la recepción.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function ConditionBox({ label, condition }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
      <span className="text-gray-600">{label}</span>
      {getConditionIcon(condition)}
    </div>
  );
}

function getConditionIcon(val) {
  if (val === 'BUENO' || val === true) {
    return <CheckCircle2 size={16} className="text-green-500" />;
  }
  if (val === 'MALO' || val === false) {
    return <AlertTriangle size={16} className="text-red-500" />;
  }
  return <span className="text-gray-400 text-xs text-center w-full block">-</span>;
}
