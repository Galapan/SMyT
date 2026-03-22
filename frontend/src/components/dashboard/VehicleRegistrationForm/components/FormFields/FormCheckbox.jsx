const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  id,
  className = '',
  disabled = false
}) => {
  const checkboxId = id || name;

  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        name={name}
        id={checkboxId}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary) disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <label htmlFor={checkboxId} className={`ml-2 text-sm font-medium ${disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-700'}`}>
        {label}
      </label>
    </div>
  );
};

export default FormCheckbox;
