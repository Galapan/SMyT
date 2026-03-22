import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';

const EMPTY_OPTIONS = [];

const ActionMenu = ({ options = EMPTY_OPTIONS }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const { x, y, refs, strategy } = useFloating({
    placement: 'bottom-end',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  // Filter out hidden options
  const visibleOptions = options.filter(opt => !opt.hidden);

  const toggleMenu = (e) => {
    e.stopPropagation();
    
    // Si vamos a abrir este menú, disparamos un evento global para cerrar los demás
    if (!isOpen) {
      document.dispatchEvent(new CustomEvent('close-all-action-menus'));
    }
    
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleCloseAll = () => {
      setIsOpen(false);
    };

    // Escuchar el evento global para cerrar cuando otro menú se abre
    document.addEventListener('close-all-action-menus', handleCloseAll);

    return () => {
      document.removeEventListener('close-all-action-menus', handleCloseAll);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (refs.domReference.current && refs.domReference.current.contains(event.target)) return;
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Use setTimeout to avoid immediate trigger from the click that opened the menu
    setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, refs.domReference]);

  if (visibleOptions.length === 0) return null;

  return (
    <>
      <button
        ref={refs.setReference}
        onClick={toggleMenu}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20"
        title="Opciones"
        aria-expanded={isOpen}
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && createPortal(
        <LazyMotion features={domAnimation}>
          <AnimatePresence>
            <m.div
              ref={(node) => {
                refs.setFloating(node);
                menuRef.current = node;
              }}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                position: strategy,
                top: Math.round(y) || 0,
                left: Math.round(x) || 0,
              }}
              className="absolute w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1 z-50 origin-top-right focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                {visibleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.label}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        option.onClick();
                      }}
                      className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors
                        ${option.danger
                          ? 'text-(--color-rojo) hover:bg-(--color-rojo)/5'
                          : option.success
                            ? 'text-(--color-verde) hover:bg-(--color-verde)/5'
                            : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {Icon && <Icon size={16} className={`mr-2.5 ${option.danger ? 'text-(--color-rojo)' : option.success ? 'text-(--color-verde)' : 'text-gray-400'}`} />}
                      <span className="font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </m.div>
          </AnimatePresence>
        </LazyMotion>,
        document.body
      )}
    </>
  );
};

export default ActionMenu;
