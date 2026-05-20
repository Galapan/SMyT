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
      rol: 'ADMINISTRADOR',
      activo: true,
      creadoPorId: superUser.id,
    },
  });
  console.log('✅ Administrador creado:', admin.email);

  // Crear Depósitos de prueba
  const deposito1 = await prisma.deposito.upsert({
    where: { id: 'deposito-test-001' },
    update: {},
    create: {
      id: 'deposito-test-001',
      nombre: 'Depósito Central Tlaxcala',
      municipio: 'Tlaxcala',
      direccion: 'Av. Principal #123, Centro, Tlaxcala, 90000',
      capacidad: 100,
      telefono: '246 123 4567',
      nombrePropietario: 'José González García',
      rfc: 'GOGJ850315ABC',
      telefonoPropietario: '246 123 4568',
      activo: true,
    },
  });
  console.log('✅ Depósito creado:', deposito1.nombre);

  const deposito2 = await prisma.deposito.upsert({
    where: { id: 'deposito-test-002' },
    update: {},
    create: {
      id: 'deposito-test-002',
      nombre: 'Depósito Vehicular Huamantla',
      municipio: 'Huamantla',
      direccion: 'Reforma 101, Centro, Huamantla, 90500',
      capacidad: 50,
      telefono: '247 456 7890',
      nombrePropietario: 'María Ramírez López',
      rfc: 'RALM900520XYZ',
      telefonoPropietario: '247 456 7891',
      activo: true,
    },
  });
  console.log('✅ Depósito creado:', deposito2.nombre);

  const deposito3 = await prisma.deposito.upsert({
    where: { id: 'deposito-test-003' },
    update: {},
    create: {
      id: 'deposito-test-003',
      nombre: 'Depósito Apizaco',
      municipio: 'Apizaco',
      direccion: 'Carretera Federal 136 Km 5, Apizaco, 90300',
      capacidad: 75,
      telefono: '241 789 0123',
      nombrePropietario: 'Carlos Hernández Sánchez',
      rfc: 'HESC750810DEF',
      telefonoPropietario: '241 789 0124',
      activo: true,
    },
  });
  console.log('✅ Depósito creado:', deposito3.nombre);

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
      rol: 'ADMINISTRADOR_CONCESIONARIO',
      activo: true,
      creadoPorId: admin.id,
      depositoId: deposito1.id,
    },
  });
  console.log('✅ Usuario Concesionario creado:', user.email);

  // Crear Vehículo de prueba
  const vehiculo1 = await prisma.vehiculo.upsert({
    where: { folioProceso: 'SEED-2026-0001' },
    update: {},
    create: {
      folioProceso: 'SEED-2026-0001',
      fechaIngreso: new Date(),
      autoridad: 'Fiscalía General del Estado',
      noInventario: 'SEED-INV-001',
      marcaTipo: 'Nissan Versa',
      anio: 2020,
      tipoServicio: 'PARTICULAR',
      vin: 'SEEDVIN123456789012',
      placa: 'SEED123',
      noSerie: '3N1AB7AP0HY123456',
      colorOriginal: 'Gris',
      colorActual: 'Gris',
      odometro: 45000,
      estatusLegal: 'DECOMISADO',
      tieneActaBaja: false,
      tieneTituloFactura: false,
      estadoCarroceria: 'BUENO',
      estadoCristales: 'COMPLETOS',
      estadoEspejos: 'COMPLETOS',
      estadoLlantasDelanteras: 'NUEVAS',
      estadoLlantasTraseras: 'NUEVAS',
      motorCompleto: true,
      bateriaPresente: true,
      tipoTransmision: 'AUTOMATICA',
      estadoAsientos: 'BUENO',
      estadoCinturones: 'COMPLETOS',
      estadoVolanteTablero: 'BUENO',
      estadoFrenos: 'FUNCIONAL',
      aireAcondicionadoFunciona: true,
      liquidosDrenados: false,
      estadoBolsasAire: 'PRESENTES',
      estatusAceite: 'PRESENTE',
      cantAceite: '3L',
      estatusAnticongelante: 'PRESENTE',
      cantAnticongelante: '2L',
      estatusCombustible: 'PRESENTE',
      cantCombustible: '1/4',
      depositoId: deposito1.id,
      registradoPorId: user.id,
      activo: true,
    },
  });
  console.log('✅ Vehículo creado:', vehiculo1.folioProceso);

  // Crear Solicitud de Edición de prueba (APROBADA)
  const solicitud1 = await prisma.solicitudEdicion.upsert({
    where: { id: 'solicitud-test-001' },
    update: {},
    create: {
      id: 'solicitud-test-001',
      motivo: 'El color registrado es incorrecto, el vehículo es color Blanco no Gris',
      camposIncorrectos: ['colorOriginal', 'colorActual'],
      estatus: 'APROBADA',
      vehiculoId: vehiculo1.id,
      solicitanteId: user.id,
      resolutorId: admin.id,
      fechaSolicitud: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Hace 7 días
      fechaResolucion: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // Hace 6 días
    },
  });
  console.log('✅ Solicitud de edición creada:', solicitud1.id);

  // Crear Solicitud de Edición de prueba (PENDIENTE)
  const vehiculo2 = await prisma.vehiculo.upsert({
    where: { folioProceso: 'SEED-2026-0002' },
    update: {},
    create: {
      folioProceso: 'SEED-2026-0002',
      fechaIngreso: new Date(),
      autoridad: 'Policía Estatal',
      noInventario: 'SEED-INV-002',
      marcaTipo: 'Chevrolet Spark',
      anio: 2019,
      tipoServicio: 'PARTICULAR',
      vin: 'SEEDVIN987654321098',
      placa: 'SEED456',
      noSerie: '3FA6P0H7XGR123456',
      colorOriginal: 'Azul',
      colorActual: 'Azul',
      odometro: 62000,
      estatusLegal: 'ROBADO',
      tieneActaBaja: false,
      tieneTituloFactura: false,
      estadoCarroceria: 'REGULAR',
      estadoCristales: 'COMPLETOS',
      estadoEspejos: 'COMPLETOS',
      estadoLlantasDelanteras: 'MEDIA_VIDA',
      estadoLlantasTraseras: 'MEDIA_VIDA',
      motorCompleto: true,
      bateriaPresente: true,
      tipoTransmision: 'MANUAL',
      estadoAsientos: 'REGULAR',
      estadoCinturones: 'COMPLETOS',
      estadoVolanteTablero: 'REGULAR',
      estadoFrenos: 'FUNCIONAL',
      aireAcondicionadoFunciona: false,
      liquidosDrenados: false,
      estadoBolsasAire: 'PRESENTES',
      estatusAceite: 'PRESENTE',
      cantAceite: '2.5L',
      estatusAnticongelante: 'PRESENTE',
      cantAnticongelante: '1.5L',
      estatusCombustible: 'PRESENTE',
      cantCombustible: '1/8',
      depositoId: deposito2.id,
      registradoPorId: user.id,
      activo: true,
    },
  });
  console.log('✅ Vehículo 2 creado:', vehiculo2.folioProceso);

  const solicitud2 = await prisma.solicitudEdicion.upsert({
    where: { id: 'solicitud-test-002' },
    update: {},
    create: {
      id: 'solicitud-test-002',
      motivo: 'El odómetro tiene un error, el vehículo tiene 75000 km no 62000',
      camposIncorrectos: ['odometro'],
      estatus: 'PENDIENTE',
      vehiculoId: vehiculo2.id,
      solicitanteId: user.id,
      fechaSolicitud: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Hace 2 días
    },
  });
  console.log('✅ Solicitud de edición pendiente creada:', solicitud2.id);

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
