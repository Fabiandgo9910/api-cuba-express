'use strict';

const express = require('express');
const router = express.Router();

// Importar todas las rutas
const userRoutes = require('./userRoutes.js');
const cuentaRoutes = require('./cuentaRoutes.js');
const clienteRoutes = require('./clienteRoutes.js');
const transferenciaRoutes = require('./transferenciaRoutes.js');

// Combinar todas las rutas
router.use('/auth', userRoutes);
router.use('/cuenta', cuentaRoutes);
router.use('/cliente', clienteRoutes);
router.use('/transferencias', transferenciaRoutes);

// Exportar el router principal
module.exports = router;