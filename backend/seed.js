const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...\n');

  // Crear Super Usuario
  const superUserPassword = await bcrypt.hash('super123', 10);
  const superUser = await prisma.usuario.upsert({
    where: { email: 'super@smyt.gob.mx' },
    update: {},
    create: {
      email: 'super@smyt.gob.mx',
      password: superUserPassword,
      nombre: 'Super',
      apellido: 'Usuario',
      rol: 'SUPER_USUARIO',
      activo: true,
    },
  });
  console.log('✅ Super Usuario creado:', superUser.email);

  // Crear Administrador SMyT
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@smyt.gob.mx' },
    update: {},
    create: {
      email: 'admin@smyt.gob.mx',
      password: adminPassword,
      nombre: 'Administrador',
      apellido: 'SMyT',
      rol: 'ADMINISTRADOR_SMYT',
      activo: true,
      creadoPorId: superUser.id,
    },
  });
  console.log('✅ Administrador creado:', admin.email);

  // Crear un Depósito de prueba
  const deposito = await prisma.deposito.upsert({
    where: { id: 'deposito-test-001' },
    update: {},
    create: {
      id: 'deposito-test-001',
      nombre: 'Depósito Central Tlaxcala',
      direccion: 'Av. Principal #123, Centro, Tlaxcala',
      activo: true,
    },
  });
  console.log('✅ Depósito creado:', deposito.nombre);

  // Crear Usuario Concesionario
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.usuario.upsert({
    where: { email: 'usuario@smyt.gob.mx' },
    update: {},
    create: {
      email: 'usuario@smyt.gob.mx',
      password: userPassword,
      nombre: 'Juan',
      apellido: 'Pérez',
      rol: 'USUARIO_CONCESIONARIO',
      activo: true,
      creadoPorId: admin.id,
      depositoId: deposito.id,
    },
  });
  console.log('✅ Usuario Concesionario creado:', user.email);

  console.log('\n🎉 Seed completado!\n');
  console.log('═══════════════════════════════════════════');
  console.log('  USUARIOS DE PRUEBA');
  console.log('═══════════════════════════════════════════');
  console.log('  📧 super@smyt.gob.mx     | 🔑 super123');
  console.log('  📧 admin@smyt.gob.mx     | 🔑 admin123');
  console.log('  📧 usuario@smyt.gob.mx   | 🔑 user123');
  console.log('═══════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
