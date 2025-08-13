const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Cuba Express Limitada',
      version: '1.0.0',
      description: 'Documentación para API de Cuba Express Limitada',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api/v1`,
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./routes/*.js'], // Ruta a tus archivos con anotaciones
};

module.exports = swaggerJsdoc(options);