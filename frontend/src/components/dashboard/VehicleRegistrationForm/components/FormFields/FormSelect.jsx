const FormSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  options = [],
  placeholder = 'Seleccionar...',
  className = ''
}) => {
  const baseClass = "w-full px-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm";
  const selectClass = error 
    ? `${baseClass} border-red-500 focus:ring-red-500` 
    : `${baseClass} border-gray-300`;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={selectClass}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormSelect;
