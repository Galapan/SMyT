import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between px-2 sm:px-6 relative">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        
        return (
          <div key={step.id} className="relative flex-1 flex flex-col items-center">
            {/* Line connecting to next step */}
            {index < steps.length - 1 && (
              <div className={`absolute top-4 sm:top-5 left-[calc(50%+1rem)] sm:left-[calc(50%+1.25rem)] right-[-50%] h-0.5 sm:h-1 -translate-y-1/2 rounded transition-all duration-300 ${
                isCompleted ? 'bg-(--color-primary)' : 'bg-gray-200'
              }`} />
            )}
            
            {/* Circle */}
            <div className={`
              relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300
              ${isCompleted ? 'bg-(--color-primary) text-white' : 
                isActive ? 'bg-(--color-primary) text-white ring-4 ring-violet-100' : 
                'bg-gray-100 text-gray-400'}
            `}>
              {isCompleted ? <Check size={16} className="sm:w-5 sm:h-5" /> : <span className="text-sm sm:text-base">{step.id}</span>}
            </div>

            {/* Label */}
            <span className={`hidden sm:block text-[10px] sm:text-xs mt-2 text-center w-full px-1 leading-tight ${
              isActive ? 'text-(--color-primary) font-medium' : 'text-gray-500'
            }`}>
              {step.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
