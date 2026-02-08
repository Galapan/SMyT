import { Wrench, Check } from 'lucide-react';

const InventorySection = ({ formData, setFormData, errors, onChange, getInputClass }) => {
  const inventoryTags = [
    'Gato Hidráulico', 
    'Llave de Cruz', 
    'Estéreo', 
    'Rueda de Refacción', 
    'Triángulos de Seg.', 
    'Extinguidor', 
    'Herramientas', 
    'Documentos'
  ];

  return (
    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
      <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2 border-b border-blue-100 pb-2">
        <Wrench size={18} />
        Inventario de Objetos y Herramientas
      </h4>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags de Inventario (Seleccione lo presente)</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {inventoryTags.map(tag => {
            const isSelected = formData.objetosPersonales.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  const newTags = isSelected
                    ? formData.objetosPersonales.filter(t => t !== tag)
                    : [...formData.objetosPersonales, tag];
                  setFormData(prev => ({ ...prev, objetosPersonales: newTags }));
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-md scale-105' 
                    : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {isSelected && <Check size={12} className="inline mr-1" />}
                {tag}
              </button>
            );
          })}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones Adicionales / Otros Objetos</label>
          <textarea
            name="observacionesInspector"
            value={formData.observacionesInspector}
            onChange={onChange}
            rows={3}
            placeholder="Describa otros objetos personales o detalles adicionales..."
            className={`${getInputClass('observacionesInspector')} resize-none`}
          />
        </div>
      </div>
    </div>
  );
};

export default InventorySection;
