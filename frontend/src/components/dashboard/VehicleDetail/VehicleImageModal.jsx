import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Modal interactivo para visualizar imágenes ampliadas
 */
export default function VehicleImageModal({ selectedImage, onClose }) {
  // Manejar cierre con tecla ESC
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, onClose]);

  if (!selectedImage) return null;

  return createPortal(
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-zoom-out"
        onClick={onClose}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md cursor-pointer z-10"
          aria-label="Cerrar imagen"
        >
          <X size={24} />
        </button>
        <m.img
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          src={selectedImage}
          alt="Foto ampliada del vehículo"
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
          onClick={(e) => e.stopPropagation()}
        />
      </m.div>
    </AnimatePresence>,
    document.getElementById('modal-root') || document.body
  );
}
