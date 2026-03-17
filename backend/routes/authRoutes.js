const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/auth/login - Autenticar usuario
router.post('/login', authController.login);

// POST /api/auth/verify-email
// Verificar cuenta de usuario con código
router.post('/verify-email', authController.verifyEmail);

// GET /api/auth/me - Obtener usuario actual (requiere JWT)
router.get('/me', verifyToken, authController.getCurrentUser);

// POST /api/auth/forgot-password - Solicitar recuperación de contraseña
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password - Restablecer contraseña con código
router.post('/reset-password', authController.resetPassword);

// POST /api/auth/verify-reset-code - Verificar código de recuperación
router.post('/verify-reset-code', authController.verifyResetCode);

// POST /api/auth/security-alert/confirm - Confirmar cambio de contraseña
router.post('/security-alert/confirm', authController.confirmSecurityAlert);

// POST /api/auth/security-alert/reject - Rechazar cambio de contraseña y desactivar cuenta
router.post('/security-alert/reject', authController.rejectSecurityAlert);

module.exports = router;
