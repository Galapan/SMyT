import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { X, ImageIcon } from 'lucide-react';

/**
 * Modal de imagen con zoom (portal)
 */
export default function VehicleImageModal({ selectedImage, springConfig, onClose }) {
  if (!selectedImage) return null;

  return createPortal(
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md cursor-zoom-out"
        style={{ zIndex: 120 }}
        onClick={onClose}
      >
        <m.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.1 }}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/80 rounded-full transition-colors backdrop-blur-sm z-10"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X size={24} />
        </m.button>

        <m.div
          layoutId={`foto-container-${selectedImage}`}
          transition={springConfig}
          className="max-w-full max-h-full flex items-center justify-center cursor-default bg-transparent"
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', height: '100%' }}
        >
          <m.img
            layoutId={`foto-img-${selectedImage}`}
            transition={springConfig}
            src={selectedImage}
            alt="Zoom preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl bg-transparent relative z-10"
          />
        </m.div>
      </m.div>
    </AnimatePresence>,
    document.getElementById('modal-root') || document.body
  );
}
