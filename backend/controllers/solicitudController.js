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
    const { depositoId, vehiculoId } = req.query;

    const whereClause = {};
    if (vehiculoId) {
      whereClause.vehiculoId = vehiculoId;
    } else if (depositoId) {
      whereClause.vehiculo = { depositoId };
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

module.exports = {
  createSolicitud,
  getSolicitudes
};
