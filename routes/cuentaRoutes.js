'use strict';

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const cuentaController = require('../controllers/cuenta');

/**
 * @swagger
 * tags:
 *   - name: Cuentas
 *     description: Endpoints para gestión de cuentas bancarias
 */

router.post("/", authMiddleware.protect, cuentaController.createCuenta);
router.get('/', authMiddleware.protect, cuentaController.getAllCuentas);
router.get('/:id', authMiddleware.protect, cuentaController.getCuenta);
router.put("/", authMiddleware.protect, cuentaController.updateCuenta);
router.delete("/", authMiddleware.protect, cuentaController.deleteCuenta);

module.exports = router;