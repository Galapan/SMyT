/**
 * Formats a role enum string for display.
 * e.g. "ADMINISTRADOR_CONCESIONARIO" → "Administrador concesionario"
 */
export const formatRole = (rol) =>
  rol
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
