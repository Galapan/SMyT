import { Loader } from 'lucide-react';

const FormInput = ({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  placeholder = '',
  helperText = '',
  maxLength,
  min,
  max,
  onKeyDown,
  className = '',
  isDuplicate = false,
  isValidating = false
}) => {
  const baseClass = "w-full px-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm";
  
  // Determinar el estilo del input
  let inputClass = baseClass;
  if (isValidating) {
    inputClass = `${baseClass} border-yellow-400 focus:ring-yellow-400`;
  } else if (error || isDuplicate) {
    inputClass = `${baseClass} border-(--color-rosa) focus:ring-(--color-rosa)`;
  } else {
    inputClass = `${baseClass} border-gray-300`;
  }

  // Determinar el mensaje a mostrar
  let displayMessage = '';
  if (isValidating) {
    displayMessage = 'Verificando...';
  } else if (error) {
    displayMessage = error;
  } else if (isDuplicate) {
    displayMessage = 'Este valor ya está registrado';
  } else if (helperText) {
    displayMessage = helperText;
  }

  // Determinar el color del mensaje
  let messageColor = 'text-gray-400';
  if (isValidating) {
    messageColor = 'text-yellow-600';
  } else if (error || isDuplicate) {
    messageColor = 'text-(--color-rosa)';
  }

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          max={max}
          className={inputClass}
        />
        {isValidating && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader className="w-4 h-4 text-yellow-600 animate-spin" />
          </div>
        )}
      </div>
      {(displayMessage || isValidating) && (
        <div className="flex items-center gap-1 mt-1">
          {isValidating && <Loader className="w-3 h-3 text-yellow-600 animate-spin" />}
          <p className={`text-xs ${messageColor}`}>{displayMessage}</p>
        </div>
      )}
    </div>
  );
};

export default FormInput;
