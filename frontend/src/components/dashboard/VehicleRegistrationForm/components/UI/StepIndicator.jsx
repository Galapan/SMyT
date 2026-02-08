import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between px-2 sm:px-6">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        
        return (
          <div key={step.id} className="flex items-center" style={{ flex: index < steps.length - 1 ? '1 0 auto' : '0 0 auto' }}>
            <div className="flex flex-col items-center shrink-0">
              <div className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${isCompleted ? 'bg-(--color-primary) text-white' : 
                  isActive ? 'bg-(--color-primary) text-white ring-4 ring-violet-100' : 
                  'bg-gray-100 text-gray-400'}
              `}>
                {isCompleted ? <Check size={16} className="sm:w-5 sm:h-5" /> : <span className="text-sm sm:text-base">{step.id}</span>}
              </div>
              {/* Hide labels on mobile as they are redundant with the step title below */}
              <span className={`hidden sm:block text-[10px] sm:text-xs mt-2 text-center w-full max-w-20 leading-tight ${isActive ? 'text-(--color-primary) font-medium' : 'text-gray-500'}`}>
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4 rounded transition-all duration-300 min-w-2.5 ${
                isCompleted ? 'bg-(--color-primary)' : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
