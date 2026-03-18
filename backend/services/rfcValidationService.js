const https = require('https');

const RFC_API_URL = 'https://3.129.253.159/api/RFC/consulta_rfc';
const RFC_API_KEY = '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5';

/**
 * Valida el formato del RFC (persona física o moral)
 * @param {string} rfc - El RFC a validar
 * @returns {object} - { valid: boolean, message: string }
 */
function validateRFCFormat(rfc) {
  if (!rfc || typeof rfc !== 'string') {
    return { valid: false, message: 'El RFC es requerido' };
  }

  const rfcUpper = rfc.toUpperCase().trim();

  // RFC persona física: 4 letras + 6 dígitos (AA MM DD) + 3 homoclave = 13 caracteres
  // RFC persona moral: 3 letras + 6 dígitos (AA MM DD) + 3 homoclave = 12 caracteres
  const physicalPersonRegex = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/;
  const moralPersonRegex = /^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$/;

  if (!physicalPersonRegex.test(rfcUpper) && !moralPersonRegex.test(rfcUpper)) {
    return { 
      valid: false, 
      message: 'El RFC no tiene un formato válido. Debe ser de 12 (moral) o 13 (física) caracteres' 
    };
  }

  // Validar que la fecha sea coherente
  const year = parseInt(rfcUpper.substring(4, 6));
  const month = parseInt(rfcUpper.substring(6, 8));
  const day = parseInt(rfcUpper.substring(8, 10));

  if (month < 1 || month > 12) {
    return { valid: false, message: 'El mes del RFC no es válido' };
  }

  if (day < 1 || day > 31) {
    return { valid: false, message: 'El día del RFC no es válido' };
  }

  return { valid: true, message: 'Formato de RFC válido' };
}

/**
 * Consulta el RFC en la API del gobierno para verificar su existencia
 * @param {string} rfc - El RFC a consultar
 * @returns {Promise<object>} - { valid: boolean, message: string, data?: object }
 */
function consultarRFC(rfc) {
  return new Promise((resolve, reject) => {
    const rfcUpper = rfc.toUpperCase().trim();

    const postData = JSON.stringify({
      apikey: RFC_API_KEY,
      rfc: rfcUpper
    });

    const options = {
      hostname: '3.129.253.159',
      port: 443,
      path: '/api/RFC/consulta_rfc',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'accept': 'text/plain'
      },
      rejectUnauthorized: false // Similar a -k en curl
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          // La API puede devolver texto plano o JSON, intentar parsear
          let response;
          try {
            response = JSON.parse(responseData);
          } catch {
            // Si no es JSON, tratar como texto plano
            response = { raw: responseData };
          }

          // Interpretar la respuesta de la API
          // Asumimos que si devuelve un error o estado negativo, el RFC no es válido
          if (response.status === 'error' || response.error) {
            resolve({
              valid: false,
              message: response.message || response.error || 'El RFC no fue encontrado en el SAT',
              apiResponse: response
            });
          } else if (response.status === 'success' || response.data || response.nombre) {
            // RFC válido encontrado
            resolve({
              valid: true,
              message: 'RFC válido y encontrado en el SAT',
              data: response,
              apiResponse: response
            });
          } else {
            // Respuesta ambigua, asumir válido pero con advertencia
            resolve({
              valid: true,
              message: 'RFC consultado exitosamente',
              data: response,
              apiResponse: response
            });
          }
        } catch (error) {
          reject(new Error(`Error al procesar respuesta de la API: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Error al conectar con la API del SAT: ${error.message}`));
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout al consultar la API del SAT'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Verifica si un RFC ya existe en la base de datos
 * @param {object} prisma - Cliente de Prisma
 * @param {string} rfc - El RFC a verificar
 * @param {string} excludeId - ID del depósito a excluir (para actualizaciones)
 * @returns {Promise<boolean>} - true si el RFC ya existe
 */
async function checkRFCExists(prisma, rfc, excludeId = null) {
  const rfcUpper = rfc.toUpperCase().trim();
  
  const whereClause = { rfc: rfcUpper };
  if (excludeId) {
    whereClause.id = { not: excludeId };
  }

  const existingDeposito = await prisma.deposito.findFirst({
    where: whereClause,
    select: { id: true, nombre: true }
  });

  return existingDeposito !== null;
}

module.exports = {
  validateRFCFormat,
  consultarRFC,
  checkRFCExists
};
