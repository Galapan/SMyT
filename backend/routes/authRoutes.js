const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/auth/login - Autenticar usuario
router.post('/login', authController.login);

// GET /api/auth/me - Obtener usuario actual (requiere JWT)
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router;
