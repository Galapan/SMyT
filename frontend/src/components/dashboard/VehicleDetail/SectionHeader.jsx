import { ImageIcon } from 'lucide-react';

/**
 * Header de sección para tarjetas de vehículo
 */
export default function SectionHeader({ icon: Icon, title, status }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-gray-600" />
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      {status && (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${status.color}`}>
          {status.label}
        </span>
      )}
    </div>
  );
}

/**
 * Fila de datos para tarjetas de información
 */
export function DataRow({ label, value, isHighlight }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium ${isHighlight ? 'text-gray-900 font-bold bg-gray-100 px-2 py-0.5 rounded border border-gray-200' : 'text-gray-900'}`}>
        {value || 'N/A'}
      </span>
    </div>
  );
}

/**
 * Placeholder para galería vacía
 */
export function EmptyGallery() {
  return (
    <div className="h-40 flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
      <ImageIcon size={32} className="text-gray-300 mb-2" />
      <p className="text-sm text-gray-500">No hay fotografías registradas.</p>
    </div>
  );
}
