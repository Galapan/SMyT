const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'smyt-secret-key-change-in-production';

/**
 * Middleware para verificar el token JWT
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // IMPORTANT: Verify that the user still exists and is active
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: { activo: true }
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        success: false,
        errorCode: 'ACCOUNT_DEACTIVATED',
        message: 'Tu cuenta ha sido desactivada por un administrador.'
      });
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

/**
 * Middleware para verificar roles permitidos
 * @param {string[]} rolesPermitidos - Array de roles que pueden acceder
 */
const requireRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado'
      });
    }

    // SUPER_USUARIO tiene acceso total a todo
    if (req.user.rol === 'SUPER_USUARIO') {
      return next();
    }

    // Verificar si el rol del usuario está en los roles permitidos
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireRole
};
