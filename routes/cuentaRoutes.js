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

/**
 * @swagger
 * /api/v1/cuenta:
 *   post:
 *     tags: [Cuentas]
 *     summary: Crear una nueva cuenta [Admin]
 *     description: Crea una nueva cuenta bancaria (requiere rol de administrador)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               noCuenta:
 *                 type: string
 *               monto:
 *                 type: number
 *               banco:
 *                 type: string
 *               origen:
 *                 type: string
 *               nombreTitular:
 *                 type: string
 *               rut:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [natural, empresa]
 *               moneda:
 *                 type: string
 *             required:
 *               - id
 *               - noCuenta
 *               - banco
 *               - nombreTitular
 *     responses:
 *       201:
 *         description: Cuenta creada exitosamente
 *       401:
 *         description: No autorizado (requiere rol de admin)
 *       400:
 *         description: Error de validación o cuenta ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", authMiddleware.protect, authMiddleware.restrictTo('admin'), cuentaController.createCuenta);

/**
 * @swagger
 * /api/v1/cuenta:
 *   get:
 *     tags: [Cuentas]
 *     summary: Obtener todas las cuentas
 *     description: Retorna una lista de todas las cuentas bancarias registradas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cuentas obtenida exitosamente
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authMiddleware.protect, cuentaController.getAllCuentas);

/**
 * @swagger
 * /api/v1/cuenta/{id}:
 *   get:
 *     tags: [Cuentas]
 *     summary: Obtener una cuenta por ID
 *     description: Retorna los detalles de una cuenta bancaria específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la cuenta a buscar
 *     responses:
 *       200:
 *         description: Cuenta encontrada exitosamente
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       400:
 *         description: ID no proporcionado
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', authMiddleware.protect, cuentaController.getCuenta);

/**
 * @swagger
 * /api/v1/cuenta:
 *   put:
 *     tags: [Cuentas]
 *     summary: Actualizar una cuenta [Admin]
 *     description: Actualiza los datos de una cuenta bancaria (requiere rol de administrador)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID de la cuenta a actualizar
 *               noCuenta:
 *                 type: string
 *               monto:
 *                 type: number
 *               banco:
 *                 type: string
 *               origen:
 *                 type: string
 *               nombreTitular:
 *                 type: string
 *               rut:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [natural, empresa]
 *               moneda:
 *                 type: string
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Cuenta actualizada exitosamente
 *       401:
 *         description: No autorizado (requiere rol de admin)
 *       400:
 *         description: ID no proporcionado o datos inválidos
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put("/", authMiddleware.protect, authMiddleware.restrictTo('admin'), cuentaController.updateCuenta);

/**
 * @swagger
 * /api/v1/cuenta:
 *   delete:
 *     tags: [Cuentas]
 *     summary: Eliminar una cuenta [Admin]
 *     description: Elimina una cuenta bancaria (requiere rol de administrador)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID de la cuenta a eliminar
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Cuenta eliminada exitosamente
 *       401:
 *         description: No autorizado (requiere rol de admin)
 *       400:
 *         description: ID no proporcionado
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/", authMiddleware.protect, authMiddleware.restrictTo('admin'), cuentaController.deleteCuenta);

/**
 * @swagger
 * /api/v1/cuenta/origen/{origen}:
 *   get:
 *     tags: [Cuentas]
 *     summary: Obtener cuentas por origen
 *     description: Retorna un listado de cuentas filtradas por el origen especificado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: origen
 *         schema:
 *           type: string
 *         required: true
 *         description: Origen de las cuentas a filtrar (ej. 'bancario', 'extranjero', etc.)
 *     responses:
 *       200:
 *         description: Lista de cuentas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cuenta'
 *       400:
 *         description: Parámetro origen no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       404:
 *         description: No se encontraron cuentas con ese origen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/origen/:origen', authMiddleware.protect, cuentaController.getCuentasByOrigen);

// Configuración de seguridad Swagger
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Cuenta:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         noCuenta:
 *           type: string
 *         monto:
 *           type: number
 *         banco:
 *           type: string
 *         origen:
 *           type: string
 *         nombreTitular:
 *           type: string
 *         rut:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [natural, empresa]
 *         moneda:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         error:
 *           type: string
 *   responses:
 *     Unauthorized:
 *       description: No autorizado (token inválido, expirado o no proporcionado)
 *     Forbidden:
 *       description: No tiene permisos para realizar esta acción (rol incorrecto)
 */

module.exports = router;