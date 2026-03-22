import { m } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

/**
 * Galería fotográfica del vehículo
 */
export default function VehicleGallery({ fotos, selectedImage, springConfig, onImageSelect }) {
  if (!fotos || fotos.length === 0) {
    return (
      <div className="h-40 flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
        <ImageIcon size={32} className="text-gray-300 mb-2" />
        <p className="text-sm text-gray-500">No hay fotografías registradas.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {fotos.map((foto, idx) => (
        <m.div
          layoutId={`foto-container-${foto}`}
          transition={springConfig}
          key={foto}
          className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group relative cursor-pointer"
          onClick={() => onImageSelect(foto)}
          whileHover="hover"
        >
          {selectedImage !== foto && (
            <m.img
              layoutId={`foto-img-${foto}`}
              transition={springConfig}
              variants={{ hover: { scale: 1.05 } }}
              src={foto}
              alt={`Evidencia ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          )}

          {/* Hover Overlay */}
          <m.div
            variants={{ hover: { opacity: 1 } }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center"
          >
            <m.div
              variants={{ hover: { scale: 1.1, opacity: 1 } }}
              initial={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ImageIcon size={28} className="text-white drop-shadow-lg" />
            </m.div>
          </m.div>
        </m.div>
      ))}
    </div>
  );
}
