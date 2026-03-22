const EMPTY_OPTIONS = [];

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  error,
  options = EMPTY_OPTIONS,
  placeholder = 'Seleccionar...',
  className = '',
  disabled = false
}) => {
  const baseClass = "w-full px-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm";
  let selectClass = baseClass;
  if (disabled) {
    selectClass = `w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed text-sm`;
  } else if (error) {
    selectClass = `${baseClass} border-gob-rosa focus:ring-gob-rosa`;
  } else {
    selectClass = `${baseClass} border-gray-300`;
  }

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectClass}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-gob-rosa mt-1">{error}</p>}
    </div>
  );
};

export default FormSelect;
