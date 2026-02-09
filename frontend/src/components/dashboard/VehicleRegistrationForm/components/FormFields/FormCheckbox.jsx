const FormCheckbox = ({ 
  label, 
  name, 
  checked, 
  onChange, 
  id,
  className = ''
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
        className="h-4 w-4 rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary)"
      />
      <label htmlFor={checkboxId} className="ml-2 text-sm font-medium text-gray-700">
        {label}
      </label>
    </div>
  );
};

export default FormCheckbox;
