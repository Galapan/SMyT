const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/emailService");

const prisma = new PrismaClient();

// Obtener perfil de usuario
const getProfile = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        fotoUrl: true,
        deposito: {
          select: {
            nombre: true,
          },
        },
      },
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el perfil",
    });
  }
};

// Actualizar perfil (nombre, apellido, foto)
const updateProfile = async (req, res) => {
  try {
    const { nombre, apellido, fotoUrl } = req.body;

    // Validar datos básicos
    if (!nombre || !apellido) {
      return res.status(400).json({
        success: false,
        message: "Nombre y apellido son requeridos",
      });
    }

    const usuario = await prisma.usuario.update({
      where: { id: req.user.id },
      data: {
        nombre,
        apellido,
        fotoUrl,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        fotoUrl: true,
      },
    });

    res.json({
      success: true,
      message: "Perfil actualizado exitosamente",
      data: usuario,
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el perfil",
    });
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar la contraseña actual y la nueva",
      });
    }

    // Buscar usuario para obtener su hash actual
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar contraseña actual
    const isValid = await bcrypt.compare(currentPassword, usuario.password);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "La contraseña actual es incorrecta",
      });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id: req.user.id },
      data: {
        password: hashedPassword,
      },
    });

    res.json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar la contraseña",
    });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol, depositoId } = req.body;

    // Obtener el rol del usuario que está realizando la petición
    const creadorId = req.user.id;
    const creadorRol = req.user.rol;

    // Validación básica de campos requeridos
    if (!nombre || !apellido || !email || !password || !rol) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos básicos son requeridos",
      });
    }

    // Validación de permisos
    if (creadorRol === "USUARIO_CONCESIONARIO") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para crear usuarios",
      });
    }

    if (
      creadorRol === "ADMINISTRADOR_SMYT" &&
      rol !== "USUARIO_CONCESIONARIO"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Los administradores solo pueden crear usuarios de tipo concesionario",
      });
    }

    // Si es concesionario, DEBE tener un deposito
    if (rol === "USUARIO_CONCESIONARIO" && !depositoId) {
      return res.status(400).json({
        success: false,
        message: "Un usuario concesionario debe estar asignado a un depósito",
      });
    }

    // Verificar si el correo ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico ya está registrado",
      });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear URL de avatar por defecto
    const defaultFotoUrl = `https://ui-avatars.com/api/?background=random&color=fff&size=512&name=${encodeURIComponent(nombre + ' ' + apellido)}`;

    // Generar código de verificación (6 dígitos)
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 24); // Expira en 24h

    // Crear el usuario
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        email: email.toLowerCase(),
        password: hashedPassword,
        rol,
        fotoUrl: defaultFotoUrl,
        verificado: false,
        codigoVerificacion: verificationCode,
        expiracionCodigo: expirationTime,
        depositoId: rol === "USUARIO_CONCESIONARIO" ? depositoId : null,
        creadoPorId: creadorId,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        fotoUrl: true,
        verificado: true,
        deposito: {
          select: {
            nombre: true,
          },
        },
      },
    });

    // Enviar correo de verificación (no bloqueamos la respuesta si falla el correo, pero lo intentamos)
    await sendVerificationEmail(email.toLowerCase(), verificationCode);

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente. Se ha enviado un código de verificación por correo.",
      data: newUser,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear el usuario",
    });
  }
};

// Obtener todos los usuarios (solo admins y super admins)
const getUsers = async (req, res) => {
  try {
    const creadorRol = req.user.rol;

    // Validación de permisos
    if (creadorRol === "USUARIO_CONCESIONARIO") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para ver usuarios",
      });
    }

    // Administrador SMyT podría ver todos o solo concesionarios (vamos a dejarlos ver todos o los de su jurisdicción, pero por simplicidad solo filtramos si es necesario)
    // El cliente pide "creación de cuentas, desde administradores hasta concesionarios" para el Super Usuario.

    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        fotoUrl: true,
        activo: true,
        createdAt: true,
        deposito: {
          select: {
            nombre: true,
          },
        },
        creadoPor: {
          select: {
            nombre: true,
            apellido: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: usuarios,
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios",
    });
  }
};

// Obtener concesionarios disponibles (sin depósito asignado)
const getAvailableConcesionarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: {
        rol: "USUARIO_CONCESIONARIO",
        depositoId: null,
        activo: true
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        fotoUrl: true,
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json({
      success: true,
      data: usuarios,
    });
  } catch (error) {
    console.error("Error al obtener concesionarios disponibles:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener concesionarios disponibles",
    });
  }
};

// Asignar depósito a un concesionario
const assignDeposito = async (req, res) => {
  try {
    const { id } = req.params;
    const { depositoId } = req.body;

    // Validación de permisos
    if (req.user.rol === "USUARIO_CONCESIONARIO") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción",
      });
    }

    if (!depositoId) {
       return res.status(400).json({
         success: false,
         message: "ID de depósito es requerido",
       });
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data: { depositoId },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        deposito: {
          select: {
            nombre: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: "Depósito asignado exitosamente",
      data: usuario,
    });
  } catch (error) {
    console.error("Error al asignar depósito:", error);
    res.status(500).json({
      success: false,
      message: "Error al asignar depósito",
    });
  }
};

// Activar/Desactivar cuenta de usuario
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Solo Super Usuario puede desactivar a otros admins/concesionarios
    if (req.user.rol !== "SUPER_USUARIO" && req.user.rol !== "ADMINISTRADOR_SMYT") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción",
      });
    }

    // No se puede desactivar a uno mismo
    if (req.user.id === id) {
       return res.status(400).json({
         success: false,
         message: "No puedes cambiar el estado de tu propia cuenta",
       });
    }

    // Buscar estado actual
    const usuarioActual = await prisma.usuario.findUnique({
      where: { id },
      select: { activo: true }
    });

    if (!usuarioActual) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Invertir estado
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: { activo: !usuarioActual.activo },
      select: {
        id: true,
        activo: true,
        nombre: true,
        apellido: true,
      }
    });

    res.json({
      success: true,
      message: `Cuenta ${usuarioActualizado.activo ? 'activada' : 'desactivada'} exitosamente`,
      data: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error al cambiar estado de cuenta:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar estado de cuenta",
    });
  }
};

// Eliminar usuario permanentemente
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Solo Super Usuario puede eliminar cuentas (puedes agregar ADMINS si quieres)
    if (req.user.rol !== "SUPER_USUARIO") {
      return res.status(403).json({
        success: false,
        message: "Solo los Super Usuarios pueden eliminar cuentas",
      });
    }

    // No se puede eliminar a uno mismo
    if (req.user.id === id) {
      return res.status(400).json({
         success: false,
         message: "No puedes eliminar tu propia cuenta",
      });
    }

    // Verificar si existe primero
    const usuarioActual = await prisma.usuario.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!usuarioActual) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Eliminar
    await prisma.usuario.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: "Usuario eliminado de forma permanente",
    });
  } catch (error) {
    console.error("Error al eliminar cuenta:", error);
    
    res.status(500).json({
      success: false,
      message: "Error al eliminar la cuenta de usuario",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  createUser,
  getUsers,
  getAvailableConcesionarios,
  assignDeposito,
  toggleStatus,
  deleteUser,
};
