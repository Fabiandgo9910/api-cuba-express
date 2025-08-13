const jwt = require('jsonwebtoken');
const config = require('../config');

const tokenService = {
  // Crear token JWT
  createToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        admin: user.admin
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );
  },

  // Verificar token JWT
  verifyToken: (token) => {
    return jwt.verify(token, config.JWT_SECRET);
  },

  // Decodificar token sin verificar (para uso interno)
  decodeToken: (token) => {
    return jwt.decode(token);
  }
};

module.exports = tokenService;