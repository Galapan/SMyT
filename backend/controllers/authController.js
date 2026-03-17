const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { sendPasswordResetEmail } = require('../utils/emailService');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'smyt-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * POST /api/auth/login
 * Autenticar usuario con email y password
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        deposito: true
      }
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario desactivado. Contacte al administrador.'
      });
    }

    // Verificar si el usuario ha verificado su cuenta
    if (!usuario.verificado) {
      return res.status(403).json({
        success: false,
        message: 'Cuenta no verificada. Por favor, verifica tu correo electrónico.',
        unverified: true, // Frontend can use this flag to redirect to verification screen
        email: usuario.email // Pass email back for the verification screen
      });
    }

    // Verificar password
    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar JWT con información del usuario
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        depositoId: usuario.depositoId
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Responder sin incluir el password
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        usuario: usuarioSinPassword,
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * GET /api/auth/me
 * Obtener datos del usuario actual (requiere token válido)
 */
const getCurrentUser = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      include: {
        deposito: true
      }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      success: true,
      data: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * POST /api/auth/verify-email
 * Verificar cuenta de usuario con código
 */
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email y código son requeridos'
      });
    }

    // Normalizar email
    const emailNormalizado = email.toLowerCase().trim();

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email: emailNormalizado }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (usuario.verificado) {
      return res.status(400).json({
        success: false,
        message: 'La cuenta ya está verificada'
      });
    }

    // Verificar si el código coincide y si no ha expirado
    if (usuario.codigoVerificacion !== code) {
      return res.status(400).json({
        success: false,
        message: 'Código de verificación incorrecto'
      });
    }

    if (new Date() > usuario.expiracionCodigo) {
      return res.status(400).json({
        success: false,
        message: 'El código de verificación ha expirado. Por favor solicita uno nuevo.'
      });
    }

    // Actualizar usuario a verificado y limpiar el código
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        verificado: true,
        codigoVerificacion: null,
        expiracionCodigo: null
      }
    });

    res.json({
      success: true,
      message: 'Cuenta verificada exitosamente'
    });

  } catch (error) {
    console.error('Error al verificar email:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al verificar la cuenta'
    });
  }
};

/**
 * POST /api/auth/forgot-password
 * Solicitar recuperación de contraseña (envía correo con código)
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const usuario = await prisma.usuario.findUnique({
      where: { email: emailNormalizado }
    });

    // Siempre devolvemos el mismo mensaje de éxito por seguridad
    // (no revelar si un correo está registrado o no)
    if (!usuario) {
      return res.json({
        success: true,
        message: 'Si el correo existe en nuestro sistema, recibirás un código de recuperación.'
      });
    }

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    // El código expira en 1 hora
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 1);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        codigoVerificacion: codigo,
        expiracionCodigo: expiracion
      }
    });

    // Enviar correo
    const emailSent = await sendPasswordResetEmail(emailNormalizado, codigo);

    if (!emailSent) {
      // Revertir el código en caso de error de envío para evitar estado inconsistente
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          codigoVerificacion: null,
          expiracionCodigo: null
        }
      });
      return res.status(500).json({
        success: false,
        message: 'Error al enviar el correo de recuperación. Por favor intenta más tarde.'
      });
    }

    res.json({
      success: true,
      message: 'Si el correo existe en nuestro sistema, recibirás un código de recuperación.'
    });

  } catch (error) {
    console.error('Error al solicitar recuperación de contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * POST /api/auth/reset-password
 * Restablecer contraseña con código de 6 dígitos
 */
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, código y nueva contraseña son requeridos'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const usuario = await prisma.usuario.findUnique({
      where: { email: emailNormalizado }
    });

    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Datos de recuperación inválidos o expirados'
      });
    }

    // Verificar si el código concuerda y no ha expirado
    if (usuario.codigoVerificacion !== code || !usuario.expiracionCodigo || new Date() > usuario.expiracionCodigo) {
      return res.status(400).json({
        success: false,
        message: 'El código de recuperación es incorrecto o ha expirado'
      });
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar usuario
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: hashedPassword,
        codigoVerificacion: null,
        expiracionCodigo: null
      }
    });

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * POST /api/auth/verify-reset-code
 * Verificar si el código de recuperación es válido sin cambiar contraseña
 */
const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email y código son requeridos'
      });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const usuario = await prisma.usuario.findUnique({
      where: { email: emailNormalizado }
    });

    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Datos de recuperación inválidos o expirados'
      });
    }

    // Verificar si el código concuerda y no ha expirado
    if (usuario.codigoVerificacion !== code || !usuario.expiracionCodigo || new Date() > usuario.expiracionCodigo) {
      return res.status(400).json({
        success: false,
        message: 'El código de recuperación es incorrecto o ha expirado'
      });
    }

    res.json({
      success: true,
      message: 'Código verificado correctamente'
    });

  } catch (error) {
    console.error('Error al verificar código de recuperación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * POST /api/auth/security-alert/confirm
 * Verify that the user confirmed the password change
 */
const confirmSecurityAlert = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token faltante' });
    }

    // Verify token structure
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.action !== 'password_change') {
      return res.status(400).json({ success: false, message: 'Acción no válida' });
    }

    // Verify single-use token in database
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    });

    if (!usuario || usuario.codigoVerificacion !== token || new Date() > usuario.expiracionCodigo) {
       return res.status(401).json({ success: false, message: 'El enlace ha expirado o ya fue utilizado.' });
    }

    // Clear the token to prevent reuse
    await prisma.usuario.update({
      where: { id: decoded.id },
      data: {
        codigoVerificacion: null,
        expiracionCodigo: null
      }
    });

    res.json({ success: true, message: 'Cambio de contraseña confirmado y enlace desactivado' });
  } catch (error) {
    console.error('Error confirming security alert:', error);
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

/**
 * POST /api/auth/security-alert/reject
 * Instantly disable an account if a user rejects a password change
 */
const rejectSecurityAlert = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token faltante' });
    }

    // Verify token structure
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.action !== 'password_change') {
      return res.status(400).json({ success: false, message: 'Acción no válida' });
    }

    // Verify single-use token in database
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    });

    if (!usuario || usuario.codigoVerificacion !== token || new Date() > usuario.expiracionCodigo) {
       return res.status(401).json({ success: false, message: 'El enlace ha expirado o ya fue utilizado.' });
    }

    // Disable the account instantly and clear the token
    await prisma.usuario.update({
      where: { id: decoded.id },
      data: { 
        activo: false,
        codigoVerificacion: null,
        expiracionCodigo: null
      }
    });

    res.json({ success: true, message: 'Cuenta asegurada, desactivada y enlace deshabilitado correctamente' });
  } catch (error) {
    console.error('Error rejecting security alert:', error);
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

module.exports = {
  login,
  getCurrentUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyResetCode,
  confirmSecurityAlert,
  rejectSecurityAlert
};
