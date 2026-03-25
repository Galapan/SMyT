const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear nueva Solicitud de Edición
const createSolicitud = async (req, res) => {
  try {
    const { vehiculoId, motivo, camposIncorrectos } = req.body;
    const solicitanteId = req.user.id; // SMyT Admin instigating this request

    if (!vehiculoId || !motivo) {
      return res.status(400).json({
        success: false,
        message: 'El ID del vehículo y el motivo son obligatorios.'
      });
    }

    if (!camposIncorrectos || !Array.isArray(camposIncorrectos) || camposIncorrectos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe seleccionar al menos un campo incorrecto.'
      });
    }

    // Verificar existencia del vehículo
    const vehiculo = await prisma.vehiculo.findUnique({ where: { id: vehiculoId } });
    if (!vehiculo) {
      return res.status(404).json({ success: false, message: 'Vehículo no encontrado.' });
    }

    // Crear solicitud
    const nuevaSolicitud = await prisma.solicitudEdicion.create({
      data: {
        motivo,
        camposIncorrectos,
        vehiculoId,
        solicitanteId,
        estatus: 'PENDIENTE',
      },
      include: {
        vehiculo: { select: { folioProceso: true, placa: true } },
        solicitante: { select: { nombre: true, apellido: true } }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Solicitud de edición enviada correctamente.',
      data: nuevaSolicitud
    });

  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al registrar la solicitud.',
      error: error.message
    });
  }
};

// Obtener todas las solicitudes pendientes para un Concesionario (o General si es SMyT)
const getSolicitudes = async (req, res) => {
  try {
    const { depositoId, vehiculoId, estatus, solicitanteId } = req.query;

    const whereClause = {};
    if (vehiculoId) {
      whereClause.vehiculoId = vehiculoId;
    } else if (depositoId) {
      whereClause.vehiculo = { depositoId };
    }

    if (estatus) {
      whereClause.estatus = estatus;
    }

    if (solicitanteId) {
      // Si se pide por solicitanteId específico, traer solicitudes de ese usuario
      whereClause.solicitanteId = solicitanteId;
    } else {
      // Role-based routing visibility for global inbox (when not asking for a specific user's requests)
      if (req.user && (req.user.rol === 'SUPER_USUARIO' || req.user.rol === 'ADMINISTRADOR')) {
        // Super usuario y Admin SMyT ven solicitudes PENDIENTES para revisar
        // Y también las APROBADAS donde ellos son los solicitantes (para editar)
        if (req.user.rol === 'SUPER_USUARIO') {
          whereClause.estatus = 'PENDIENTE';
          whereClause.solicitante = { rol: 'ADMINISTRADOR' };
        } else {
          // ADMINISTRADOR: ve PENDIENTES de ADMINISTRADOR_CONCESIONARIO 
          // y APROBADAS donde él es el solicitante (para editar)
          whereClause.OR = [
            { estatus: 'PENDIENTE', solicitante: { rol: 'ADMINISTRADOR_CONCESIONARIO' } },
            { estatus: 'APROBADA', solicitanteId: req.user.id }
          ];
        }
      } else if (req.user && req.user.rol === 'ADMINISTRADOR_CONCESIONARIO') {
        // Concesionarios ven sus solicitudes APROBADAS para editar
        whereClause.solicitanteId = req.user.id;
        whereClause.estatus = 'APROBADA';
      }
    }

    const solicitudes = await prisma.solicitudEdicion.findMany({
      where: whereClause,
      include: {
        vehiculo: { select: { id: true, folioProceso: true, placa: true, anio: true, marcaTipo: true } },
        solicitante: { select: { nombre: true, email: true, rol: true, apellido: true } },
        resolutor: { select: { nombre: true, email: true } },
        aprobadoPor: { select: { nombre: true, email: true } },
        completadoPor: { select: { nombre: true, email: true } }
      },
      orderBy: { fechaSolicitud: 'desc' }
    });

    res.json({
      success: true,
      data: solicitudes
    });
  } catch (error) {
    console.error('Error fetching solicitudes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al consultar solicitudes.'
    });
  }
};

// Resolver Solicitud (Aprobar o Rechazar)
const resolveSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { estatus } = req.body; // 'APROBADA' o 'RECHAZADA'
    const resolutorId = req.user.id;

    if (!['APROBADA', 'RECHAZADA'].includes(estatus)) {
      return res.status(400).json({
        success: false,
        message: 'Estatus inválido. Debe ser APROBADA o RECHAZADA.'
      });
    }

    // Verificar si existe la solicitud
    const solicitud = await prisma.solicitudEdicion.findUnique({ where: { id } });

    if (!solicitud) {
      return res.status(404).json({ success: false, message: 'Solicitud no encontrada.' });
    }

    if (solicitud.estatus !== 'PENDIENTE') {
      return res.status(400).json({ success: false, message: 'La solicitud ya fue procesada anteriormente.' });
    }

    // Actualizar la solicitud
    const solicitudActualizada = await prisma.solicitudEdicion.update({
      where: { id },
      data: {
        estatus,
        fechaResolucion: new Date(),
        resolutorId,
        aprobadoPorId: estatus === 'APROBADA' ? resolutorId : null
      }
    });

    res.json({
      success: true,
      message: `Solicitud ${estatus.toLowerCase()} correctamente.`,
      data: solicitudActualizada
    });

  } catch (error) {
    console.error('Error al resolver solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al resolver la solicitud.',
      error: error.message
    });
  }
};

// Completar Solicitud de Edición (solo el solicitante original puede completar)
const completeSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const completadoPorId = req.user.id;

    // Verificar si existe la solicitud
    const solicitud = await prisma.solicitudEdicion.findUnique({ 
      where: { id },
      include: { solicitante: true }
    });

    if (!solicitud) {
      return res.status(404).json({ success: false, message: 'Solicitud no encontrada.' });
    }

    // Solo el solicitante original puede completar la solicitud
    if (solicitud.solicitanteId !== completadoPorId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Solo el solicitante original puede completar esta solicitud.' 
      });
    }

    if (solicitud.estatus !== 'APROBADA') {
      return res.status(400).json({ 
        success: false, 
        message: 'Solo se pueden completar solicitudes que estén aprobadas.' 
      });
    }

    // Actualizar la solicitud a COMPLETADA
    const solicitudActualizada = await prisma.solicitudEdicion.update({
      where: { id },
      data: {
        estatus: 'COMPLETADA',
        fechaResolucion: new Date(),
        completadoPorId
      }
    });

    res.json({
      success: true,
      message: 'Solicitud completada correctamente.',
      data: solicitudActualizada
    });

  } catch (error) {
    console.error('Error al completar solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al completar la solicitud.',
      error: error.message
    });
  }
};

module.exports = {
  createSolicitud,
  getSolicitudes,
  resolveSolicitud,
  completeSolicitud
};
