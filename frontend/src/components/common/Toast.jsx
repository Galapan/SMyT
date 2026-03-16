import React, { useEffect } from 'react';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, X } from 'lucide-react';

const Toast = ({ show, message, type = 'success', onClose, duration = 3000 }) => {

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {show && (
          <m.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-4 right-4 z-9999 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border bg-white ${
              type === 'success' 
                ? 'border-(--color-verde)/30 text-(--color-verde) bg-linear-to-r from-white to-(--color-verde)/5' 
                : 'border-(--color-rojo)/30 text-(--color-rojo) bg-linear-to-r from-white to-(--color-rojo)/5'
            }`}
          >
            <div className={`flex shrink-0 w-8 h-8 rounded-full items-center justify-center ${
              type === 'success' ? 'bg-(--color-verde)/20 text-(--color-verde)' : 'bg-(--color-rojo)/20 text-(--color-rojo)'
            }`}>
              {type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            </div>
            <p className="text-sm font-medium pr-4 text-gray-800">{message}</p>
            <button 
              type="button"
              onClick={onClose}
              className={`p-1 rounded-md transition-colors ${
                type === 'success' ? 'hover:bg-(--color-verde)/20 text-(--color-verde)' : 'hover:bg-(--color-rojo)/20 text-(--color-rojo)'
              }`}
            >
              <X size={16} />
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default Toast;
