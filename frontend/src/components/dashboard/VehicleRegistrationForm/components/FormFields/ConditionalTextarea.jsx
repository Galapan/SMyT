const ConditionalTextarea = ({ 
  name, 
  value, 
  onChange, 
  error,
  placeholder,
  rows = 3,
  className = ''
}) => {
  const baseClass = "w-full px-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm resize-none";
  const textareaClass = error 
    ? `${baseClass} border-red-500 focus:ring-red-500` 
    : `${baseClass} border-gray-300`;

  return (
    <div className={`mt-2 animate-fade-in ${className}`}>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={textareaClass}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default ConditionalTextarea;
