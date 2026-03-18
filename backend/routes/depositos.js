const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { verifyToken: authenticateToken } = require('../middleware/authMiddleware');
const { validateRFCFormat, consultarRFC, checkRFCExists } = require('../services/rfcValidationService');

const prisma = new PrismaClient();

// GET /api/depositos - Obtener todos los depósitos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const depositos = await prisma.deposito.findMany({
      include: {
        _count: {
          select: {
            vehiculos: true,
            usuarios: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Agregar número secuencial
    const depositosConNumero = depositos.map((dep, index) => ({
      ...dep,
      numero: String(depositos.length - index).padStart(2, '0'),
      vehiculosActuales: dep._count.vehiculos
    }));

    res.json({
      success: true,
      data: depositosConNumero
    });
  } catch (error) {
    console.error('Error fetching depositos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los depósitos'
    });
  }
});

// GET /api/depositos/stats - Obtener estadísticas de depósitos
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [totalDepositos, depositosActivos, vehiculosEnDepositos] = await Promise.all([
      prisma.deposito.count(),
      prisma.deposito.count({ where: { activo: true } }),
      prisma.vehiculo.count({ where: { activo: true } })
    ]);

    const depositos = await prisma.deposito.findMany({
      where: { activo: true },
      select: { capacidad: true }
    });

    const capacidadTotal = depositos.reduce((sum, dep) => sum + dep.capacidad, 0);

    res.json({
      success: true,
      data: {
        totalDepositos,
        depositosActivos,
        capacidadTotal,
        vehiculosEnDepositos
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas'
    });
  }
});

// GET /api/depositos/audit - Obtener depositos para auditoria (concesionarios) con sus usuarios
router.get('/audit', authenticateToken, async (req, res) => {
  try {
    const whereClause = { activo: true };
    if (req.user && req.user.rol === 'ADMINISTRADOR_CONCESIONARIO') {
      if (!req.user.depositoId) {
        return res.json({ success: true, data: [] });
      }
      whereClause.id = req.user.depositoId;
    }

    const depositos = await prisma.deposito.findMany({
      where: whereClause,
      include: {
        usuarios: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            rol: true,
            fotoUrl: true,
            activo: true
          }
        },
        _count: {
          select: { vehiculos: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: depositos
    });
  } catch (error) {
    console.error('Error fetching audit depositos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la información de auditoría'
    });
  }
});

// POST /api/depositos - Crear nuevo depósito
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      nombre,
      municipio,
      direccion,
      capacidad,
      telefono,
      nombrePropietario,
      rfc,
      telefonoPropietario,
      crearCuenta,
      email,
      password,
      validarRFC // Bandera para validar RFC con API del SAT
    } = req.body;

    // Validaciones de campos requeridos
    if (!nombre || !municipio || !direccion || !capacidad || !telefono || !nombrePropietario || !rfc || !telefonoPropietario) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // 1. Validar formato del RFC
    const formatoValido = validateRFCFormat(rfc);
    if (!formatoValido.valid) {
      return res.status(400).json({
        success: false,
        message: formatoValido.message
      });
    }

    // 2. Validar que el RFC no exista ya en la base de datos
    const rfcExistente = await checkRFCExists(prisma, rfc);
    if (rfcExistente) {
      return res.status(400).json({
        success: false,
        message: 'El RFC ya está registrado en otro depósito. No se permiten duplicados'
      });
    }

    // 3. Validar RFC con la API del SAT si se solicita
    if (validarRFC) {
      try {
        const validacionSAT = await consultarRFC(rfc);
        if (!validacionSAT.valid) {
          return res.status(400).json({
            success: false,
            message: `El RFC no fue encontrado en el SAT: ${validacionSAT.message}`
          });
        }
      } catch (error) {
        console.error('Error al validar RFC con el SAT:', error.message);
        // No bloquear el registro si falla la validación, solo advertir
      }
    }

    // Crear el depósito
    const deposito = await prisma.deposito.create({
      data: {
        nombre,
        municipio,
        direccion,
        capacidad: parseInt(capacidad),
        telefono,
        nombrePropietario,
        rfc: rfc.toUpperCase(),
        telefonoPropietario
      }
    });

    // Si se solicita crear cuenta de usuario
    if (crearCuenta && email && password) {
      // Verificar que el email no exista
      const existingUser = await prisma.usuario.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      // Separar nombre y apellido
      const nombreParts = nombrePropietario.trim().split(' ');
      const userFirstName = nombreParts[0];
      const userLastName = nombreParts.slice(1).join(' ') || userFirstName;

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario concesionario
      await prisma.usuario.create({
        data: {
          email,
          password: hashedPassword,
          nombre: userFirstName,
          apellido: userLastName,
          rol: 'ADMINISTRADOR_CONCESIONARIO',
          depositoId: deposito.id,
          creadoPorId: req.user.id
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Depósito registrado exitosamente',
      data: deposito
    });
  } catch (error) {
    console.error('Error creating deposito:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el depósito'
    });
  }
});

// GET /api/depositos/:id - Obtener un depósito específico
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deposito = await prisma.deposito.findUnique({
      where: { id },
      include: {
        vehiculos: {
          where: { activo: true },
          select: {
            id: true,
            folioProceso: true,
            placa: true,
            marcaTipo: true,
            vin: true,
            estatusLegal: true,
            fechaIngreso: true
          }
        },
        usuarios: {
          where: { activo: true },
          select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true,
            rol: true,
            fotoUrl: true
          }
        }
      }
    });

    if (!deposito) {
      return res.status(404).json({
        success: false,
        message: 'Depósito no encontrado'
      });
    }

    res.json({
      success: true,
      data: deposito
    });
  } catch (error) {
    console.error('Error fetching deposito:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el depósito'
    });
  }
});

// PUT /api/depositos/:id - Actualizar un depósito
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      municipio,
      direccion,
      capacidad,
      telefono,
      nombrePropietario,
      rfc,
      telefonoPropietario,
      validarRFC // Bandera para validar RFC con API del SAT
    } = req.body;

    // Validaciones de campos requeridos
    if (!nombre || !municipio || !direccion || !capacidad || !telefono || !nombrePropietario || !rfc || !telefonoPropietario) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // 1. Validar formato del RFC
    const formatoValido = validateRFCFormat(rfc);
    if (!formatoValido.valid) {
      return res.status(400).json({
        success: false,
        message: formatoValido.message
      });
    }

    // 2. Validar que el RFC no exista ya en otro depósito (excluyendo el actual)
    const rfcExistente = await checkRFCExists(prisma, rfc, id);
    if (rfcExistente) {
      return res.status(400).json({
        success: false,
        message: 'El RFC ya está registrado en otro depósito. No se permiten duplicados'
      });
    }

    // 3. Validar RFC con la API del SAT si se solicita
    if (validarRFC) {
      try {
        const validacionSAT = await consultarRFC(rfc);
        if (!validacionSAT.valid) {
          return res.status(400).json({
            success: false,
            message: `El RFC no fue encontrado en el SAT: ${validacionSAT.message}`
          });
        }
      } catch (error) {
        console.error('Error al validar RFC con el SAT:', error.message);
        // No bloquear la actualización si falla la validación, solo advertir
      }
    }

    const deposito = await prisma.deposito.update({
      where: { id },
      data: {
        nombre,
        municipio,
        direccion,
        capacidad: parseInt(capacidad),
        telefono,
        nombrePropietario,
        rfc: rfc.toUpperCase(),
        telefonoPropietario
      }
    });

    res.json({
      success: true,
      message: 'Depósito actualizado exitosamente',
      data: deposito
    });
  } catch (error) {
    console.error('Error updating deposito:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el depósito'
    });
  }
});

// PATCH /api/depositos/:id/toggle-status - Activar/Desactivar un depósito
router.patch('/:id/toggle-status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener el estado actual
    const current = await prisma.deposito.findUnique({ where: { id } });
    if (!current) {
      return res.status(404).json({ success: false, message: 'Depósito no encontrado' });
    }

    const deposito = await prisma.deposito.update({
      where: { id },
      data: { activo: !current.activo }
    });

    res.json({
      success: true,
      message: deposito.activo ? 'Depósito activado exitosamente' : 'Depósito desactivado exitosamente',
      data: deposito
    });
  } catch (error) {
    console.error('Error toggling deposito status:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del depósito'
    });
  }
});

// DELETE /api/depositos/:id - Desactivar un depósito (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deposito = await prisma.deposito.update({
      where: { id },
      data: { activo: false }
    });

    res.json({
      success: true,
      message: 'Depósito desactivado exitosamente',
      data: deposito
    });
  } catch (error) {
    console.error('Error deleting deposito:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desactivar el depósito'
    });
  }
});

// POST /api/depositos/rfc/check - Verificar si un RFC ya existe
router.post('/rfc/check', authenticateToken, async (req, res) => {
  try {
    const { rfc } = req.body;

    if (!rfc) {
      return res.status(400).json({
        success: false,
        message: 'El RFC es requerido'
      });
    }

    const existe = await checkRFCExists(prisma, rfc);

    res.json({
      success: true,
      exists: existe
    });
  } catch (error) {
    console.error('Error checking RFC:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar el RFC'
    });
  }
});

// POST /api/depositos/rfc/validate - Validar RFC con el SAT
router.post('/rfc/validate', authenticateToken, async (req, res) => {
  try {
    const { rfc } = req.body;

    if (!rfc) {
      return res.status(400).json({
        success: false,
        message: 'El RFC es requerido'
      });
    }

    // Validar formato
    const formatoValido = validateRFCFormat(rfc);
    if (!formatoValido.valid) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: formatoValido.message
      });
    }

    // Consultar con el SAT
    const validacionSAT = await consultarRFC(rfc);

    res.json({
      success: true,
      valid: validacionSAT.valid,
      message: validacionSAT.message,
      data: validacionSAT.data
    });
  } catch (error) {
    console.error('Error validating RFC with SAT:', error);
    res.status(500).json({
      success: false,
      valid: false,
      message: `Error al validar con el SAT: ${error.message}`
    });
  }
});

module.exports = router;
