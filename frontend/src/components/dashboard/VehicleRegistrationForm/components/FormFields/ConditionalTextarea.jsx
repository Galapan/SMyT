const ConditionalTextarea = ({
  name,
  value,
  onChange,
  error,
  placeholder,
  rows = 3,
  className = '',
  disabled = false
}) => {
  const baseClass = "w-full px-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm resize-none";
  let textareaClass = baseClass;
  if (disabled) {
    textareaClass = `w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed text-sm resize-none`;
  } else if (error) {
    textareaClass = `${baseClass} border-gob-rosa focus:ring-gob-rosa`;
  } else {
    textareaClass = `${baseClass} border-gray-300`;
  }

  return (
    <div className={`mt-2 animate-fade-in ${className}`}>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={textareaClass}
      />
      {error && <p className="text-xs text-gob-rosa mt-1">{error}</p>}
    </div>
  );
};

export default ConditionalTextarea;
