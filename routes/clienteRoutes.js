'use strict';

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const clienteController = require('../controllers/cliente');

/**
 * @swagger
 * tags:
 *   - name: Clientes
 *     description: Endpoints para gestión de clientes
 */

router.get("/", authMiddleware.protect, clienteController.getClientes);
router.get("/:id", authMiddleware.protect, clienteController.getCliente);
router.post("/", authMiddleware.protect, clienteController.createCliente);
router.put("/", authMiddleware.protect, clienteController.updateCliente);
router.delete("/", authMiddleware.protect, clienteController.deleteCliente);

module.exports = router;