/**
 * Valida que una contraseña cumpla con los requisitos de seguridad:
 * - Al menos 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos una letra minúscula
 * - Al menos un número
 * - Al menos un carácter especial (!@#$%^&*()_+{}|:"<>?~`-=[];',./)
 *
 * @param {string} password - La contraseña a validar
 * @returns {{ valid: boolean, message?: string, missing?: string[] }} Resultado de la validación
 */
const validatePassword = (password) => {
  if (!password) {
    return {
      valid: false,
      message: 'La contraseña es requerida',
      missing: ['password']
    };
  }

  const missing = [];

  // Validar longitud mínima (8 caracteres)
  if (password.length < 8) {
    missing.push('minLength');
  }

  // Validar al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    missing.push('uppercase');
  }

  // Validar al menos una minúscula
  if (!/[a-z]/.test(password)) {
    missing.push('lowercase');
  }

  // Validar al menos un número
  if (!/[0-9]/.test(password)) {
    missing.push('number');
  }

  // Validar al menos un carácter especial
  if (!/[!@#$%^&*()_+{}|:"<>?~`\-=[\];',./]/.test(password)) {
    missing.push('specialChar');
  }

  if (missing.length > 0) {
    const messages = {
      minLength: 'Al menos 8 caracteres',
      uppercase: 'Una letra mayúscula',
      lowercase: 'Una letra minúscula',
      number: 'Un número',
      specialChar: 'Un carácter especial (!@#$%^&*...)'
    };

    return {
      valid: false,
      message: `La contraseña debe cumplir con: ${missing.map(m => messages[m]).join(', ')}`,
      missing
    };
  }

  return { valid: true };
};

/**
 * Obtiene los requisitos de contraseña como array de objetos para frontend
 * @returns {Array<{ rule: string, label: string }>}
 */
const getPasswordRequirements = () => [
  { rule: 'minLength', label: 'Al menos 8 caracteres' },
  { rule: 'uppercase', label: 'Una letra mayúscula (A-Z)' },
  { rule: 'lowercase', label: 'Una letra minúscula (a-z)' },
  { rule: 'number', label: 'Un número (0-9)' },
  { rule: 'specialChar', label: 'Un carácter especial (!@#$%^&*...)' }
];

module.exports = {
  validatePassword,
  getPasswordRequirements
};
