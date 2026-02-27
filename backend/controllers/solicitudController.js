const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear nueva Solicitud de Edición
const createSolicitud = async (req, res) => {
  try {
    const { vehiculoId, motivo } = req.body;
    const solicitanteId = req.user.id; // SMyT Admin instigating this request

    if (!vehiculoId || !motivo) {
      return res.status(400).json({
        success: false,
        message: 'El ID del vehículo y el motivo son obligatorios.'
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
      whereClause.solicitanteId = solicitanteId;
    }

    const solicitudes = await prisma.solicitudEdicion.findMany({
      where: whereClause,
      include: {
        vehiculo: { select: { id: true, folioProceso: true, placa: true, anio: true, marcaTipo: true } },
        solicitante: { select: { nombre: true, email: true } },
        resolutor: { select: { nombre: true, email: true } }
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
    const { estatus } = req.body; // 'RESUELTA' o 'CANCELADA' (o 'RECHAZADA')
    const resolutorId = req.user.id;

    if (!['RESUELTA', 'RECHAZADA', 'COMPLETADA'].includes(estatus)) {
      return res.status(400).json({
        success: false,
        message: 'Estatus inválido. Debe ser RESUELTA, RECHAZADA o COMPLETADA.'
      });
    }

    // Verificar si existe la solicitud
    const solicitud = await prisma.solicitudEdicion.findUnique({ where: { id } });
    
    if (!solicitud) {
      return res.status(404).json({ success: false, message: 'Solicitud no encontrada.' });
    }

    if (estatus === 'COMPLETADA' && solicitud.estatus !== 'RESUELTA') {
      return res.status(400).json({ success: false, message: 'Solo se pueden completar solicitudes resueltas.' });
    } else if (estatus !== 'COMPLETADA' && solicitud.estatus !== 'PENDIENTE') {
      return res.status(400).json({ success: false, message: 'La solicitud ya fue procesada anteriormente.' });
    }

    // Actualizar la solicitud
    const solicitudActualizada = await prisma.solicitudEdicion.update({
      where: { id },
      data: {
        estatus,
        fechaResolucion: new Date(),
        resolutorId
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

module.exports = {
  createSolicitud,
  getSolicitudes,
  resolveSolicitud
};
