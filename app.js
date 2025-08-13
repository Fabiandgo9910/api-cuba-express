'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const path = require('path');

// Importaciones de rutas y configuración
const swaggerSpec = require('./swagger-config');
const apiRoutes = require('./routes');

// Inicializar aplicación Express
const app = express();

// 1. Middlewares de seguridad
app.use(cors()); // Habilitar CORS

// Limitar peticiones desde una misma IP

// Body parser, lectura de datos del body
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization contra NoSQL query injection

// Data sanitization contra XSS


// 3. Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// 4. Documentación API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
// Ruta para exportar la especificación Swagger en JSON
app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});
const yaml = require('js-yaml');

// Ruta para exportar la especificación Swagger en YAML
app.get('/api-docs-yaml', (req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  res.send(yaml.dump(specs));
});

// 5. Rutas
app.use('/api/v1', apiRoutes); // Otras rutas API
const routes = require('./routes');
app.use('/api/v1', routes); // Todas las rutas tendrán el prefijo /api

// 7. Ruta para manejar 404


module.exports = app;