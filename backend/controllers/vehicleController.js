const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Validar datos duplicados (para usar en tiempo real durante el registro)
const validateDuplicateData = async (req, res) => {
  try {
    const { folioProceso, vin, placa, noMotor, noInventario, excludeId } = req.body;

    if (!folioProceso && !vin && !placa && !noMotor && !noInventario) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un campo para validar'
      });
    }

    const whereConditions = [];

    if (folioProceso) {
      whereConditions.push({ folioProceso: folioProceso.toUpperCase() });
    }
    if (vin) {
      whereConditions.push({ vin: vin.toUpperCase() });
    }
    if (placa) {
      whereConditions.push({ placa: placa.toUpperCase() });
    }
    if (noMotor) {
      whereConditions.push({ noMotor: noMotor.toUpperCase() });
    }
    if (noInventario) {
      whereConditions.push({ noInventario: noInventario.toUpperCase() });
    }

    // Si estamos en modo edición, excluir el vehículo actual
    if (excludeId) {
      const existingVehicle = await prisma.vehiculo.findUnique({ where: { id: excludeId } });
      if (!existingVehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehículo no encontrado'
        });
      }
    }

    const duplicateVehicle = await prisma.vehiculo.findFirst({
      where: {
        AND: [
          { OR: whereConditions },
          excludeId ? { id: { not: excludeId } } : {},
          { activo: true }
        ].filter(Boolean)
      },
      select: {
        id: true,
        folioProceso: true,
        vin: true,
        placa: true,
        noMotor: true,
        noInventario: true
      }
    });

    if (duplicateVehicle) {
      const duplicates = {
        folioProceso: duplicateVehicle.folioProceso === folioProceso?.toUpperCase(),
        vin: duplicateVehicle.vin === vin?.toUpperCase(),
        placa: duplicateVehicle.placa === placa?.toUpperCase(),
        noMotor: duplicateVehicle.noMotor === noMotor?.toUpperCase(),
        noInventario: duplicateVehicle.noInventario === noInventario?.toUpperCase()
      };

      return res.json({
        success: true,
        hasDuplicate: true,
        duplicates
      });
    }

    res.json({
      success: true,
      hasDuplicate: false,
      duplicates: {}
    });

  } catch (error) {
    console.error('Error al validar datos duplicados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al validar datos duplicados',
      error: error.message
    });
  }
};

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
    const whereClause = { activo: true };
    if (req.user && req.user.rol === 'ADMINISTRADOR_CONCESIONARIO') {
      if (!req.user.depositoId) {
        // User not assigned to any deposit — return empty
        return res.json({ success: true, data: [], count: 0, noDeposito: true });
      }
      whereClause.depositoId = req.user.depositoId;
    }

    const vehiculos = await prisma.vehiculo.findMany({
      where: whereClause,
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
    // We adjust to UTC-6 since SMyT works on Mexico timezone (-6h)
    // Server might be in UTC. So getting new Date() directly might lead to 'tomorrow' or 'yesterday'
    // in comparison to user's perspective.
    const today = new Date();
    // Move to UTC-6
    today.setHours(today.getHours() - 6);
    // Set to start of day
    today.setUTCHours(0, 0, 0, 0);
    // Move back to system tz, since Prisma uses UTC internally, we need to provide a UTC Date that represents midnight UTC-6
    const startOfDayUTC6 = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 6, 0, 0, 0));

    const startOfMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1, 6, 0, 0, 0));

    const whereBase = { activo: true };
    const whereHoy = { fechaIngreso: { gte: startOfDayUTC6 }, activo: true };
    const whereLiberados = { fechaSalida: { gte: startOfMonth }, activo: false };

    if (req.user && req.user.rol === 'ADMINISTRADOR_CONCESIONARIO') {
      if (!req.user.depositoId) {
        return res.json({
          success: true,
          data: { totalVehiculos: 0, ingresosHoy: 0, liberadosMes: 0, totalDepositos: 0 },
          noDeposito: true
        });
      }
      whereBase.depositoId = req.user.depositoId;
      whereHoy.depositoId = req.user.depositoId;
      whereLiberados.depositoId = req.user.depositoId;
    }

    const [totalVehiculos, ingresosHoy, liberadosMes, depositos] = await Promise.all([
      prisma.vehiculo.count({ where: whereBase }),
      prisma.vehiculo.count({
        where: whereHoy
      }),
      prisma.vehiculo.count({
        where: whereLiberados
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

// Actualizar vehículo por ID
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener datos del body (similar a createVehicle)
    const {
      folioProceso, fechaIngreso, autoridad, documentosAdjuntos, fotos,
      noInventario, marcaTipo, anio, tipoServicio, vin, placa, noMotor, colorOriginal, colorActual, odometro,
      estatusLegal, tieneActaBaja, noOficio, fechaActaBaja, tieneTituloFactura,
      estadoCarroceria, estadoCristales, estadoEspejos, estadoLlantasDelanteras, estadoLlantasTraseras,
      motorCompleto, bateriaPresente, tipoTransmision, estadoAsientos, estadoCinturones, estadoVolanteTablero,
      estadoFrenos, aireAcondicionadoFunciona, liquidosDrenados, estadoBolsasAire,
      estatusAceite, cantAceite, estatusAnticongelante, cantAnticongelante, estatusCombustible, cantCombustible,
      objetosPersonales, observacionesInspector,
      depositoId
    } = req.body;

    // Verificar que el vehículo exista
    const vehiculoExistente = await prisma.vehiculo.findUnique({ where: { id } });
    if (!vehiculoExistente) {
      return res.status(404).json({ success: false, message: 'Vehículo no encontrado' });
    }

    // Preparar objeto de actualización
    const updateData = {
      folioProceso,
      fechaIngreso: fechaIngreso ? new Date(fechaIngreso) : undefined,
      autoridad,
      documentosAdjuntos: documentosAdjuntos || undefined,
      fotos: fotos || undefined,
      noInventario,
      marcaTipo,
      anio: anio ? parseInt(anio) : undefined,
      tipoServicio,
      vin: vin ? vin.toUpperCase() : undefined,
      placa: placa ? placa.toUpperCase() : undefined,
      noMotor,
      colorOriginal,
      colorActual,
      odometro: odometro ? parseInt(odometro) : undefined,
      estatusLegal,
      tieneActaBaja: tieneActaBaja !== undefined ? tieneActaBaja : undefined,
      noOficio: noOficio !== undefined ? noOficio : undefined,
      fechaActaBaja: fechaActaBaja ? new Date(fechaActaBaja) : undefined,
      tieneTituloFactura: tieneTituloFactura !== undefined ? tieneTituloFactura : undefined,
      estadoCarroceria, estadoCristales, estadoEspejos, estadoLlantasDelanteras, estadoLlantasTraseras,
      motorCompleto, bateriaPresente, tipoTransmision, estadoAsientos, estadoCinturones, estadoVolanteTablero,
      estadoFrenos, aireAcondicionadoFunciona, liquidosDrenados, estadoBolsasAire,
      estatusAceite, cantAceite, estatusAnticongelante, cantAnticongelante, estatusCombustible, cantCombustible,
      objetosPersonales: objetosPersonales || undefined,
      observacionesInspector,
    };

    if (depositoId) {
       updateData.depositoId = depositoId;
    }

    // Filtrar campos undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const vehiculoActualizado = await prisma.vehiculo.update({
      where: { id },
      data: updateData,
      include: {
        deposito: true
      }
    });

    res.json({
      success: true,
      message: 'Vehículo actualizado exitosamente',
      data: vehiculoActualizado
    });

  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el vehículo',
      error: error.message
    });
  }
};

// Registrar salida de vehículo
const registerDeparture = async (req, res) => {
  try {
    const { id } = req.params;
    const { justificacionBaja } = req.body;

    // Solo Administrador Concesionario (o Super Usuario) debería poder registrar salidad
    if (req.user.rol === 'ADMINISTRADOR') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para registrar la salida de un vehículo'
      });
    }

    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id }
    });

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    if (!vehiculo.activo) {
       return res.status(400).json({
         success: false,
         message: 'El vehículo ya ha sido dado de baja o registrado como salida'
       });
    }

    // Si es concesionario, verificar que el vehículo le pertenece
    if (req.user.rol === 'ADMINISTRADOR_CONCESIONARIO' && vehiculo.depositoId !== req.user.depositoId) {
       return res.status(403).json({
         success: false,
         message: 'No puedes registrar la salida de un vehículo que no está en tu depósito'
       });
    }

    const vehiculoActualizado = await prisma.vehiculo.update({
      where: { id },
      data: {
        activo: false,
        fechaSalida: new Date(),
        justificacionBaja: justificacionBaja || 'Registro de salida por concesionario'
      }
    });

    res.json({
      success: true,
      message: 'Salida de vehículo registrada exitosamente',
      data: vehiculoActualizado
    });

  } catch (error) {
    console.error('Error al registrar salida de vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar la salida del vehículo',
      error: error.message
    });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleStats,
  getVehicleById,
  updateVehicle,
  registerDeparture,
  validateDuplicateData
};
