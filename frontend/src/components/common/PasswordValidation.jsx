import { Check, X } from 'lucide-react';

/**
 * Componente que muestra los requisitos de contraseña y su estado de validación
 * @param {Object} props
 * @param {string} props.password - La contraseña actual a validar
 * @param {boolean} props.showRequirements - Si se deben mostrar los requisitos (default: true)
 */
export default function PasswordValidation({ password = '', showRequirements = true }) {
  const requirements = [
    {
      rule: 'minLength',
      label: 'Al menos 8 caracteres',
      test: (pwd) => pwd.length >= 8
    },
    {
      rule: 'uppercase',
      label: 'Una letra mayúscula (A-Z)',
      test: (pwd) => /[A-Z]/.test(pwd)
    },
    {
      rule: 'lowercase',
      label: 'Una letra minúscula (a-z)',
      test: (pwd) => /[a-z]/.test(pwd)
    },
    {
      rule: 'number',
      label: 'Un número (0-9)',
      test: (pwd) => /[0-9]/.test(pwd)
    },
    {
      rule: 'specialChar',
      label: 'Un carácter especial (!@#$%^&*...)',
      test: (pwd) => /[!@#$%^&*()_+{}|:"<>?~`\-=[\];',./]/.test(pwd)
    }
  ];

  if (!showRequirements && password.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
      <p className="text-xs font-semibold text-gray-600 mb-2">
        La contraseña debe cumplir con:
      </p>
      <ul className="space-y-1">
        {requirements.map((req) => {
          const isValid = req.test(password);
          return (
            <li
              key={req.rule}
              className={`flex items-center gap-2 text-xs transition-colors ${
                isValid ? 'text-verde' : 'text-gray-500'
              }`}
            >
              {isValid ? (
                <Check className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{req.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
