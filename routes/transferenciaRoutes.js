'use strict';

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const transferenciaController = require('../controllers/transferencias');

/**
 * @swagger
 * tags:
 *   - name: Transferencias
 *     description: Endpoints para gestión de transferencias
 */

router.get('/', authMiddleware.protect, transferenciaController.getTransferencias);
router.get('/:id', authMiddleware.protect, transferenciaController.getTransferencia);
router.post("/", authMiddleware.protect, transferenciaController.createTransferencia);
router.put("/", authMiddleware.protect, transferenciaController.updateTransferencia);
router.delete("/", authMiddleware.protect, transferenciaController.deleteTransferencia);

module.exports = router;