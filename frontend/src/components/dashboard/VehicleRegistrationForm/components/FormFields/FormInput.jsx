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
  className = ''
}) => {
  const baseClass = "w-full px-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm";
  const inputClass = error 
    ? `${baseClass} border-red-500 focus:ring-red-500` 
    : `${baseClass} border-gray-300`;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
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
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
    </div>
  );
};

export default FormInput;
