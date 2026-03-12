const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ejecutar cada hora: '0 * * * *'
// Para pruebas (cada minuto): '* * * * *'
const startAccountCleanupJob = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Iniciando limpieza de cuentas no verificadas expiradas...');
    
    try {
      const now = new Date();
      
      const result = await prisma.usuario.deleteMany({
        where: {
          verificado: false,
          expiracionCodigo: {
            lt: now // Menor que ahora (ya expiró)
          }
        }
      });
      
      if (result.count > 0) {
        console.log(`[CRON] Se eliminaron ${result.count} cuentas no verificadas y expiradas.`);
      } else {
        console.log('[CRON] No se encontraron cuentas para eliminar.');
      }
    } catch (error) {
      console.error('[CRON] Error al limpiar cuentas:', error);
    }
  });

  console.log('Cron job de limpieza de cuentas inicializado.');
};

module.exports = {
  startAccountCleanupJob
};
