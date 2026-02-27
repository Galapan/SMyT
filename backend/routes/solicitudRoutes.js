const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createSolicitud, getSolicitudes, resolveSolicitud } = require('../controllers/solicitudController');

// Protegemos todas las rutas
router.use(verifyToken);

// GET /api/solicitudes
router.get('/', getSolicitudes);

// POST /api/solicitudes
router.post('/', createSolicitud);

// PUT /api/solicitudes/:id/resolve
router.put('/:id/resolve', resolveSolicitud);

module.exports = router;
