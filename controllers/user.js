const User = require("../models/user");
const tokenService = require("../service");
const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');


const authController = {
  // Registro de usuario
  signUp: async (req, res, next) => {
    try {
      // Validación de entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id, rol, email, displayName, password, admin = false } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new AppError('El email ya está en uso', 400));
      }

      // Crear nuevo usuario
      const newUser = new User({
        id,
        rol,
        email,
        displayName,
        password,
        admin
      });

      // Guardar usuario en la base de datos
      await newUser.save();

      // Generar token JWT
      const token = tokenService.createToken(newUser);

      // Enviar respuesta
      res.status(201).json({
        status: 'success',
        token,
        data: {
          user: {
            id: newUser.id,
            _id: newUser._id,
            rol: newUser.rol,
            email: newUser.email,
            displayName: newUser.displayName,
            admin: newUser.admin
          }
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // Inicio de sesión
  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new AppError('Email y contraseña requeridos', 400));
      }

      const user = await User.findOne({ email }).select('+password');
      if (!user) return next(new AppError('Credenciales inválidas', 401));

      // ✅ Verificación directa con await
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return next(new AppError('Credenciales inválidas', 401));

      // Resto de tu lógica
      const token = tokenService.createToken(user);
      res.status(200).json({ token });

    } catch (error) {
      next(error);
    }
  },
  // Obtener todos los usuarios (solo para administradores)
  getUsers: async (req, res, next) => {
    try {
      const users = await User.find().select('-password');

      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener un usuario por ID (solo para administradores)
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findOne({ id }).select('-password');

      if (!user) {
        return next(new AppError('No se encontró ningún usuario con ese ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Actualizar usuario (solo para administradores o el propio usuario)
  updateUser: async (req, res, next) => {
    try {
      const { id, ...updateData } = req.body;

      // 1) Verificar si se proporcionó ID
      if (!id) {
        return next(new AppError('Se requiere el ID del usuario', 400));
      }

      // 2) Verificar si el usuario existe usando tu campo ID personalizado
      const user = await User.findOne({ id: id }); // Busca por tu campo personalizado "id"
      if (!user) {
        return next(new AppError('No se encontró ningún usuario con ese ID', 404));
      }

      // 3) Verificar permisos (solo admin o el propio usuario puede editar)
      if (req.user.id !== user.id && !req.user.admin) {
        return next(new AppError('No tienes permiso para realizar esta acción', 403));
      }

      // 4) Definir campos no permitidos para actualización
      const forbiddenFields = ['password', 'signupDate', 'lastLogin', '_id', '__v', 'id']; // Agregado 'id' a campos prohibidos

      // 5) Filtrar campos no permitidos
      const filteredUpdateData = {};
      for (const key in updateData) {
        if (!forbiddenFields.includes(key)) {
          // Validación especial para campo admin
          if (key === 'admin' && !req.user.admin) {
            return next(new AppError('Solo un administrador puede cambiar el rol de usuario', 403));
          }
          filteredUpdateData[key] = updateData[key];
        }
      }

      // 6) Actualizar usando el _id de MongoDB encontrado
      const updatedUser = await User.findByIdAndUpdate(
        user._id, // Usamos el _id de MongoDB del usuario encontrado
        filteredUpdateData,
        {
          new: true,
          runValidators: true
        }
      ).select('-password');

      if (!updatedUser) {
        return next(new AppError('Error al actualizar el usuario', 500));
      }

      res.status(200).json({
        status: 'success',
        data: {
          user: updatedUser
        }
      });

    } catch (error) {
      // Manejo específico para errores de validación
      if (error.name === 'ValidationError') {
        return next(new AppError(error.message, 400));
      }
      next(error);
    }
  },

  // Eliminar usuario (solo para administradores)
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findOneAndDelete({ id });

      if (!user) {
        return next(new AppError('No se encontró ningún usuario con ese ID', 404));
      }

      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;