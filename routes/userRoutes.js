'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and registration
 *   - name: Users
 *     description: User management operations
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 5f8d0d55b54764421b7156c3
 *         rol:
 *           type: int
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         displayName:
 *           type: string
 *           example: John Doe
 *         admin:
 *           type: boolean
 *           example: false
 *         signupDate:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           example: 2023-01-02T12:00:00.000Z
 *     AuthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         token:
 *           type: string
 *           description: JWT token
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: fail
 *         message:
 *           type: string
 *           example: Error description
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - rol
 *               - email
 *               - displayName
 *               - password
 *             properties:
 *               id:
 *                 type: string
 *               rol: 
 *                 type: number
 *               email:
 *                 type: string
 *                 format: email
 *               displayName:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               admin:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post('/signup', authController.signUp);

/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Authenticate user
 *     description: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/signin', authController.signIn);

/**
 * @swagger
 * /api/v1/auth/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve list of all registered users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (requires admin)
 *       500:
 *         description: Internal server error
 */
router.get('/users/', authMiddleware.protect, authMiddleware.restrictTo('admin'), authController.getUsers);

/**
 * @swagger
 * /api/v1/auth/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user details by ID (Admin or own profile)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (trying to access other user's data)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/users/:id', authMiddleware.protect, authController.getUserById);

/**
 * @swagger
 * /api/v1/auth/users:
 *   put:
 *     summary: Update user (Admin or own profile)
 *     description: Update user information. Admins can update any user, regular users can only update their own profile.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               admin:
 *                 type: boolean
 *                 description: Only admins can modify this field
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (trying to modify admin status without privileges)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/users', authMiddleware.protect, authController.updateUser);

/**
 * @swagger
 * /api/v1/auth/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     description: Permanently delete a user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (requires admin)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/users/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), authController.deleteUser);

module.exports = router;