const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear nuevo vehículo
const createVehicle = async (req, res) => {
  try {
    const {
      // Paso 1
      folioProceso,
      fechaIngreso,
      autoridad,
      documentosAdjuntos,
      fotos,
      // Paso 2
      noInventario,
      marcaTipo,
      anio,
      tipoServicio,
      vin,
      placa,
      noMotor,
      colorOriginal,
      colorActual,
      odometro,
      // Paso 3
      estatusLegal,
      tieneActaBaja,
      noOficio,
      fechaActaBaja,
      tieneTituloFactura,
      // Paso 4
      estadoCarroceria,
      estadoCristales,
      estadoEspejos,
      estadoLlantasDelanteras,
      estadoLlantasTraseras,
      motorCompleto,
      bateriaPresente,
      tipoTransmision,
      estadoAsientos,
      estadoCinturones,
      estadoVolanteTablero,
      estadoFrenos,
      aireAcondicionadoFunciona,
      liquidosDrenados,
      estadoBolsasAire,
      estatusAceite,
      cantAceite,
      estatusAnticongelante,
      cantAnticongelante,
      estatusCombustible,
      cantCombustible,
      objetosPersonales,
      observacionesInspector,
      // Control
      depositoId,
      registradoPorId
    } = req.body;

    // Validaciones básicas
    if (!folioProceso || !fechaIngreso || !autoridad) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos administrativos requeridos'
      });
    }

    if (!noInventario || !marcaTipo || !anio || !tipoServicio || !vin || !placa || !noMotor) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos del vehículo requeridos'
      });
    }

    if (!estatusLegal) {
      return res.status(400).json({
        success: false,
        message: 'El estatus legal es requerido'
      });
    }

    // Verificar si ya existe un vehículo con el mismo folio, VIN o placa
    const existingVehicle = await prisma.vehiculo.findFirst({
      where: {
        OR: [
          { folioProceso },
          { vin },
          { placa },
          { noInventario }
        ]
      }
    });

    if (existingVehicle) {
      let duplicateField = '';
      if (existingVehicle.folioProceso === folioProceso) duplicateField = 'folio de proceso';
      else if (existingVehicle.vin === vin) duplicateField = 'VIN';
      else if (existingVehicle.placa === placa) duplicateField = 'placa';
      else if (existingVehicle.noInventario === noInventario) duplicateField = 'número de inventario';

      return res.status(400).json({
        success: false,
        message: `Ya existe un vehículo con el mismo ${duplicateField}`
      });
    }

    let deposito = null;
    if (depositoId) {
      deposito = await prisma.deposito.findUnique({ where: { id: depositoId } });
    } else if (req.user && req.user.depositoId) {
      deposito = await prisma.deposito.findUnique({ where: { id: req.user.depositoId } });
    }

    if (!deposito) {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar el depósito (concesionario) del vehículo'
      });
    }

    // Crear el vehículo
    const vehiculo = await prisma.vehiculo.create({
      data: {
        // Paso 1
        folioProceso,
        fechaIngreso: new Date(fechaIngreso),
        autoridad,
        documentosAdjuntos: documentosAdjuntos || [],
        fotos: fotos || [],
        // Paso 2
        noInventario,
        marcaTipo,
        anio: parseInt(anio),
        tipoServicio,
        vin: vin.toUpperCase(),
        placa: placa.toUpperCase(),
        noMotor,
        colorOriginal,
        colorActual,
        odometro: parseInt(odometro),
        // Paso 3
        estatusLegal,
        tieneActaBaja: tieneActaBaja || false,
        noOficio: noOficio || null,
        fechaActaBaja: fechaActaBaja ? new Date(fechaActaBaja) : null,
        tieneTituloFactura: tieneTituloFactura || false,
        // Paso 4
        estadoCarroceria: estadoCarroceria || null,
        estadoCristales: estadoCristales || null,
        estadoEspejos: estadoEspejos || null,
        estadoLlantasDelanteras: estadoLlantasDelanteras || null,
        estadoLlantasTraseras: estadoLlantasTraseras || null,
        motorCompleto: motorCompleto || false,
        bateriaPresente: bateriaPresente || false,
        tipoTransmision: tipoTransmision || null,
        estadoAsientos: estadoAsientos || null,
        estadoCinturones: estadoCinturones || null,
        estadoVolanteTablero: estadoVolanteTablero || null,
        estadoFrenos: estadoFrenos || null,
        aireAcondicionadoFunciona: aireAcondicionadoFunciona || false,
        liquidosDrenados: liquidosDrenados || false,
        estadoBolsasAire: estadoBolsasAire || null,
        estatusAceite: estatusAceite || null,
        cantAceite: cantAceite || null,
        estatusAnticongelante: estatusAnticongelante || null,
        cantAnticongelante: cantAnticongelante || null,
        estatusCombustible: estatusCombustible || null,
        cantCombustible: cantCombustible || null,
        objetosPersonales: objetosPersonales || [],
        observacionesInspector: observacionesInspector || null,
        // Relaciones
        depositoId: deposito.id,
        registradoPorId: registradoPorId || req.user.id
      },
      include: {
        deposito: true,
        registradoPor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Vehículo registrado exitosamente',
      data: vehiculo
    });

  } catch (error) {
    console.error('Error al crear vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el vehículo',
      error: error.message
    });
  }
};

// Obtener todos los vehículos
const getAllVehicles = async (req, res) => {
  try {
    const vehiculos = await prisma.vehiculo.findMany({
      where: { activo: true },
      include: {
        deposito: true,
        registradoPor: {
          select: {
            id: true,
            nombre: true,
            apellido: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: vehiculos,
      count: vehiculos.length
    });

  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los vehículos'
    });
  }
};

// Obtener estadísticas
const getVehicleStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalVehiculos, ingresosHoy, liberadosMes, depositos] = await Promise.all([
      prisma.vehiculo.count({ where: { activo: true } }),
      prisma.vehiculo.count({
        where: {
          fechaIngreso: { gte: today },
          activo: true
        }
      }),
      prisma.vehiculo.count({
        where: {
          fechaSalida: { gte: startOfMonth },
          activo: false
        }
      }),
      prisma.deposito.count({ where: { activo: true } })
    ]);

    res.json({
      success: true,
      data: {
        totalVehiculos,
        ingresosHoy,
        liberadosMes,
        totalDepositos: depositos
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
};

// Obtener vehículo por ID
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id },
      include: {
        deposito: true,
        registradoPor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true
          }
        }
      }
    });

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    res.json({
      success: true,
      data: vehiculo
    });

  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el vehículo'
    });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleStats,
  getVehicleById
};
