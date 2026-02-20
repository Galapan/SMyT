const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

// Para operaciones de Storage en el backend, usar Service Role Key
// (tiene permisos de escritura sin necesidad de políticas RLS)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Configurar multer para almacenamiento en memoria
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG, WebP, GIF) y PDF.'));
    }
  }
});

// Subir archivo a Supabase Storage
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    const file = req.file;
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    const filePath = `vehiculos/${uniqueName}`;
    const bucketName = 'vehicle-photos';

    // Subir a Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error subiendo a Supabase:', error);
      return res.status(500).json({
        success: false,
        message: `Error en Supabase Storage: ${error.message}`
      });
    }

    // Obtener la URL pública
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    res.json({
      success: true,
      data: {
        url: publicUrlData.publicUrl,
        fileName: uniqueName,
        originalName: file.originalname,
        size: file.size,
        type: file.mimetype
      }
    });

  } catch (error) {
    console.error('Error en uploadFile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno al procesar el archivo'
    });
  }
};

module.exports = {
  upload,
  uploadFile
};
