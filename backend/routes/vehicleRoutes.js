const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  createVehicle,
  getAllVehicles,
  getVehicleStats,
  getVehicleById
} = require('../controllers/vehicleController');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// POST /api/vehiculos - Crear nuevo vehículo
router.post('/', createVehicle);

// GET /api/vehiculos - Obtener todos los vehículos
router.get('/', getAllVehicles);

// GET /api/vehiculos/stats - Obtener estadísticas
router.get('/stats', getVehicleStats);

// GET /api/vehiculos/:id - Obtener vehículo por ID
router.get('/:id', getVehicleById);

module.exports = router;
