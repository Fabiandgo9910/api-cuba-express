const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');

// 1. Define las opciones directamente aquí para asegurar que no sean undefined
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentación completa de la API',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./routes/*.js'], // Asegúrate que esta ruta sea correcta
};

// 2. Genera las specs
const specs = swaggerJsdoc(options);

// 3. Verifica que specs existe antes de escribir
if (!specs) {
  console.error('Error: No se pudo generar la documentación Swagger');
  process.exit(1);
}

// 4. Escribe el archivo con manejo de errores
try {
  fs.writeFileSync('./swagger.json', JSON.stringify(specs, null, 2));
  console.log('✅ Documentación Swagger generada en swagger.json');
} catch (err) {
  console.error('❌ Error al guardar el archivo:', err);
}