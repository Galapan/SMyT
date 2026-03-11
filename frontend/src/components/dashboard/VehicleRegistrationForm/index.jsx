import { createPortal } from 'react-dom';
import { FileText, Car, Shield, ClipboardCheck, AlertCircle } from 'lucide-react';
import { useVehicleForm } from './hooks/useVehicleForm';

// UI Components
import ModalHeader from './components/UI/ModalHeader';
import StepIndicator from './components/UI/StepIndicator';
import NavigationFooter from './components/UI/NavigationFooter';
import Toast from '../../common/Toast';

// Step Components
import Step1AdministrativeData from './components/Steps/Step1AdministrativeData';
import Step2VehicleData from './components/Steps/Step2VehicleData';
import Step3LegalStatus from './components/Steps/Step3LegalStatus';
import Step4PhysicalInspection from './components/Steps/Step4PhysicalInspection';

const VehicleRegistrationForm = ({ isOpen, onClose, onSuccess, initialData }) => {
  const {
    currentStep,
    direction,
    loading,
    error,
    setError,
    errors,
    formData,
    setFormData,
    handleChange,
    handleNumericKeyDown,
    nextStep,
    prevStep,
    handleSubmit,
    getInputClass
  } = useVehicleForm(onClose, onSuccess, initialData);

  const steps = [
    { id: 1, name: 'Datos Administrativos', icon: FileText },
    { id: 2, name: 'Datos del Vehículo', icon: Car },
    { id: 3, name: 'Estatus Legal', icon: Shield },
    { id: 4, name: 'Inspección Física', icon: ClipboardCheck }
  ];

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-800/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Cerrar"
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up-fade flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-8 pt-6 pb-4 border-b border-gray-100">
          <ModalHeader onClose={onClose} />
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Global Error */}
        <Toast 
          show={!!error}
          message={error}
          type="error"
          onClose={() => setError("")}
        />

        {/* Form Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)]">
          <div 
            key={currentStep}
            className={`${direction === 'right' ? 'animate-slide-right' : 'animate-slide-left'}`}
          >
            {currentStep === 1 && (
              <Step1AdministrativeData 
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />
            )}

            {currentStep === 2 && (
              <Step2VehicleData 
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onKeyDown={handleNumericKeyDown}
              />
            )}

            {currentStep === 3 && (
              <Step3LegalStatus 
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />
            )}

            {currentStep === 4 && (
              <Step4PhysicalInspection 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                onChange={handleChange}
                onKeyDown={handleNumericKeyDown}
                getInputClass={getInputClass}
              />
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <NavigationFooter 
          currentStep={currentStep}
          totalSteps={4}
          onPrevious={prevStep}
          onNext={nextStep}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default VehicleRegistrationForm;
