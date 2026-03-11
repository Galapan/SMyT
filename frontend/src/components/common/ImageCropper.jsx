import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As Base64 string
  return croppedCanvas.toDataURL('image/jpeg');
}

const ImageCropper = ({ imageSrc, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const handleSaveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error('Error cropping image', e);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onCancel]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: 'spring', damping: 25, stiffness: 300 } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 } 
    }
  };

  return createPortal(
    <AnimatePresence>
      <LazyMotion features={domAnimation}>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <m.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-gray-800/40 backdrop-blur-md"
          onClick={onCancel}
        />

        {/* Modal Container */}
        <m.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[80vh] sm:h-auto sm:max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-4 relative mt-2 p-6 pb-0">
            <h2 className="text-2xl font-black text-gray-900 leading-tight">Recortar Foto</h2>
            
            {/* Close Button */}
            <button 
              onClick={onCancel}
              className="absolute top-6 right-6 p-2 bg-gray-100/50 hover:bg-gray-200/80 text-gray-500 hover:text-gray-800 rounded-full transition-all z-10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cropper Container */}
          <div className="relative flex-1 min-h-75 w-full bg-gray-900 overflow-hidden mx-6 rounded-2xl" style={{ width: 'calc(100% - 3rem)' }}>
            {imageSrc ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={onCropChange}
                onCropComplete={onCropCompleteHandler}
                onZoomChange={onZoomChange}
              />
            ) : (
               <div className="flex items-center justify-center h-full text-white">
                   Cargando imagen...
               </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 space-y-6 z-10 w-full relative">
              <div className="space-y-2 px-4">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block text-center">Zoom: {Math.round(zoom * 100)}%</label>
                  <div className="flex items-center space-x-4 w-full bg-white/60 p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <button 
                      onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                      className="p-2 hover:bg-violet-50 rounded-full text-gray-400 hover:text-(--color-primary) transition-colors"
                  >
                      -
                  </button>
                  <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-(--color-primary)"
                  />
                  <button 
                      onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                      className="p-2 hover:bg-violet-50 rounded-full text-gray-400 hover:text-(--color-primary) transition-colors"
                  >
                      +
                  </button>
                  </div>
              </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={onCancel}
                className="px-6 py-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCrop}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-(--color-primary) text-white font-medium hover:bg-violet-900 transition-colors shadow-md hover:shadow-lg"
              >
                <Check size={18} />
                <span>Guardar Recorte</span>
              </button>
            </div>
          </div>
          
          {/* Bottom Gradient Decor */}
          <div className="h-4 w-full bg-linear-to-t from-gray-50 to-transparent absolute bottom-0 pointer-events-none rounded-b-3xl"></div>
        </m.div>
      </div>
      </LazyMotion>
    </AnimatePresence>,
    document.getElementById('modal-root') || document.body
  );
};

export default ImageCropper;
