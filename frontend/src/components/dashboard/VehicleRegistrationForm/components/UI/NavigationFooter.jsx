import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';

const NavigationFooter = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSubmit, 
  loading 
}) => {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-4 flex items-center justify-between">
      <button
        onClick={onPrevious}
        disabled={currentStep === 1 || loading}
        className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
          currentStep === 1 || loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <ChevronLeft size={18} />
        Anterior
      </button>

      <span className="text-sm text-gray-500">
        Paso {currentStep} de {totalSteps}
      </span>

      {currentStep < totalSteps ? (
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-(--color-primary) hover:bg-violet-900 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          Siguiente
          <ChevronRight size={18} />
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <Check size={18} />
              Registrar Vehículo
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default NavigationFooter;
