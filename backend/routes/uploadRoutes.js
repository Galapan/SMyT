const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { upload, uploadFile } = require('../controllers/uploadController');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// POST /api/upload - Subir un archivo
router.post('/', upload.single('file'), uploadFile);

module.exports = router;
