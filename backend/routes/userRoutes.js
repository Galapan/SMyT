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

// GET /api/users/concesionarios/disponibles - Obtener concesionarios sin deposito asignado
router.get('/concesionarios/disponibles', userController.getAvailableConcesionarios);

// PUT /api/users/:id/deposito - Asignar deposito a un usuario
router.put('/:id/deposito', userController.assignDeposito);

// PUT /api/users/:id/status - Activar/Desactivar cuenta
router.put('/:id/status', userController.toggleStatus);

// GET /api/users - Obtener todos los usuarios (solo Admin/Super)
router.get('/', userController.getUsers);

// POST /api/users - Crear usuario (solo Admin/Super)
router.post('/', userController.createUser);

// El AddAccountModal usa /concesionario, así que vamos a darle alias a createUser por si acaso
router.post('/concesionario', userController.createUser);

module.exports = router;
