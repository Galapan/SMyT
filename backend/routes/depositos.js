const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { verifyToken: authenticateToken } = require('../middleware/authMiddleware');

const prisma = new PrismaClient();

// GET /api/depositos - Obtener todos los depósitos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const depositos = await prisma.deposito.findMany({
      where: { activo: true },
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
      password
    } = req.body;

    // Validaciones
    if (!nombre || !municipio || !direccion || !capacidad || !telefono || !nombrePropietario || !rfc || !telefonoPropietario) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
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
          rol: 'USUARIO_CONCESIONARIO',
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
            rol: true
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
      telefonoPropietario
    } = req.body;

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

module.exports = router;
