import { Wrench, Check } from 'lucide-react';

const InventorySection = ({ formData, setFormData, errors, onChange, getInputClass, isCampoEditable }) => {
  // Verificar si los campos son editables
  const editable = {
    objetosPersonales: isCampoEditable ? isCampoEditable('objetosPersonales') : true,
    observacionesInspector: isCampoEditable ? isCampoEditable('observacionesInspector') : true
  };

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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <Wrench size={20} className="text-gray-700" />
        <h4 className="font-semibold text-gray-800">Inventario de Objetos y Herramientas</h4>
      </div>
      <div className="p-6 space-y-6">
        <label htmlFor="inventory-tags" className="block text-sm font-medium text-gray-700 mb-1">Tags de Inventario (Seleccione lo presente)</label>
        <div id="inventory-tags" className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Tags de Inventario">
          {inventoryTags.map(tag => {
            const isSelected = formData.objetosPersonales.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  if (!editable.objetosPersonales) return;
                  const newTags = isSelected
                    ? formData.objetosPersonales.filter(t => t !== tag)
                    : [...formData.objetosPersonales, tag];
                  setFormData(prev => ({ ...prev, objetosPersonales: newTags }));
                }}
                disabled={!editable.objetosPersonales}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'bg-white border text-gray-600 hover:bg-gray-50 border-gray-200'
                } ${!editable.objetosPersonales ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSelected && <Check size={12} className="inline mr-1" />}
                {tag}
              </button>
            );
          })}
        </div>
        <div>
          <label htmlFor="observacionesInspector" className="block text-sm font-medium text-gray-700 mb-1">Observaciones Adicionales / Otros Objetos</label>
          <textarea
            id="observacionesInspector"
            name="observacionesInspector"
            value={formData.observacionesInspector}
            onChange={onChange}
            rows={3}
            disabled={!editable.observacionesInspector}
            placeholder="Describa otros objetos personales o detalles adicionales..."
            className={`${getInputClass('observacionesInspector')} resize-none ${!editable.observacionesInspector ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};

export default InventorySection;
