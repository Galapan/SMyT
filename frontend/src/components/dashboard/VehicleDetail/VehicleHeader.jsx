import { m } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import dayjs from 'dayjs';

/**
 * Header del expediente de vehículo
 */
export default function VehicleHeader({ vehiculo, userRol, onBack, onEditRequest }) {
  return (
    <div className="shrink-0 bg-white rounded-xl border border-gray-200 p-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-10 relative">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
          title="Atrás"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Expediente de Vehículo</h1>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold border border-gray-200 bg-gray-100 text-gray-700">
              Folio: {vehiculo.folioProceso}
            </span>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
            <MapPin size={14} className="text-gray-400" />
            Depósito: <span className="font-semibold text-gray-700">{vehiculo.deposito?.nombre}</span>
            <span className="mx-1 text-gray-300">|</span>
            <Calendar size={14} className="text-gray-400" />
            Ingreso: {dayjs(vehiculo.fechaIngreso).format('DD MMM YYYY, HH:mm')}
          </p>
        </div>
      </div>

    </div>
  );
}
