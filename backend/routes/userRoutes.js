const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Middleware de autenticación para todas las rutas de usuario
router.use(verifyToken);

// GET /api/users/profile - Obtener perfil del usuario
router.get('/profile', userController.getProfile);

// PUT /api/users/profile - Actualizar perfil
router.put('/profile', userController.updateProfile);

// PUT /api/users/change-password - Cambiar contraseña
router.put('/change-password', userController.changePassword);

module.exports = router;
