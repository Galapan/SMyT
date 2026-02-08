import ExteriorSection from './ExteriorSection';
import MechanicalSection from './MechanicalSection';
import InteriorSection from './InteriorSection';
import EnvironmentalSection from './EnvironmentalSection';
import InventorySection from './InventorySection';

const Step4PhysicalInspection = ({ formData, setFormData, errors, onChange, onKeyDown, getInputClass }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-(--color-primary)">
          Paso 4: Inspección Física
        </h3>
        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">
          Cumplimiento Normativo Estricto
        </span>
      </div>
      
      <ExteriorSection 
        formData={formData}
        errors={errors}
        onChange={onChange}
        onKeyDown={onKeyDown}
        getInputClass={getInputClass}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MechanicalSection 
          formData={formData}
          errors={errors}
          onChange={onChange}
          getInputClass={getInputClass}
        />

        <InteriorSection 
          formData={formData}
          errors={errors}
          onChange={onChange}
          getInputClass={getInputClass}
        />
      </div>

      <EnvironmentalSection 
        formData={formData}
        errors={errors}
        onChange={onChange}
        getInputClass={getInputClass}
      />

      <InventorySection 
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onChange={onChange}
        getInputClass={getInputClass}
      />
    </div>
  );
};

export default Step4PhysicalInspection;
