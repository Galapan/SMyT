const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const depositosRoutes = require('./routes/depositos');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'SMyT API - Sistema de Gestión de Depósitos Vehiculares',
    version: '1.0.0'
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Vehicle routes
app.use('/api/vehiculos', vehicleRoutes);

// Depositos routes
app.use('/api/depositos', depositosRoutes);

// User routes
app.use('/api/users', userRoutes);

// Upload routes
app.use('/api/upload', uploadRoutes);

// Solicitudes routes
app.use('/api/solicitudes', solicitudRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
