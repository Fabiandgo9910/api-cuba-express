const tokenService = require('../service');
const User = require('../models/user');
const AppError = require('../utils/appError');

const authMiddleware = {
  // Proteger rutas - requiere autenticación
  protect: async (req, res, next) => {
    try {
      // 1) Obtener el token y verificar que existe
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return next(
          new AppError('No estás autenticado. Por favor inicia sesión para obtener acceso.', 401)
        );
      }

      // 2) Verificar el token
      const decoded = tokenService.verifyToken(token);

      // 3) Verificar si el usuario todavía existe
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next(
          new AppError('El usuario perteneciente a este token ya no existe.', 401)
        );
      }

      // 4) Guardar usuario en la solicitud
      req.user = currentUser;
      next();
    } catch (error) {
      next(error);
    }
  },

  // Restringir a ciertos roles (ej. admin)
  restrictTo: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.admin ? 'admin' : 'user')) {
        return next(
          new AppError('No tienes permiso para realizar esta acción', 403)
        );
      }

      next();
    };
  }
};

module.exports = authMiddleware;