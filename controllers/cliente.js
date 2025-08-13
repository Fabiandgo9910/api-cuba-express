'use strict';

const Cliente = require('../models/cliente');

/**
 * Controlador para operaciones CRUD de clientes
 */
const clienteController = {

  /**
   * Obtiene un cliente por ID
   */
  async getCliente(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el parámetro ID'
        });
      }

      const cliente = await Cliente.findOne({id});

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: cliente
      });

    } catch (error) {
      console.error('Error en getCliente:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el cliente',
        error: error.message
      });
    }
  },

  /**
   * Obtiene todos los clientes
   */
  async getClientes(req, res) {
    try {
      const clientes = await Cliente.find({});

      res.status(200).json({
        success: true,
        count: clientes.length,
        data: clientes
      });

    } catch (error) {
      console.error('Error en getClientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los clientes',
        error: error.message
      });
    }
  },

  /**
   * Actualiza un cliente por ID
   */
  async updateCliente(req, res) {
    try {
      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el campo ID en el body'
        });
      }

      const clienteActualizado = await Cliente.findOneAndUpdate(
        { id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!clienteActualizado) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: clienteActualizado
      });

    } catch (error) {
      console.error('Error en updateCliente:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el cliente',
        error: error.message
      });
    }
  },

  /**
   * Elimina un cliente por ID
   */
  async deleteCliente(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el campo ID en el body'
        });
      }

      const clienteEliminado = await Cliente.findOneAndDelete(id);

      if (!clienteEliminado) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Cliente eliminado correctamente',
        data: clienteEliminado
      });

    } catch (error) {
      console.error('Error en deleteCliente:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el cliente',
        error: error.message
      });
    }
  },

  /**
   * Crea un nuevo cliente
   */
  async createCliente(req, res) {
    try {
      const { id } = req.body;

      // Validar si el cliente ya existe
      if (id) {
        const clienteExistente = await Cliente.findOne({ id });
        if (clienteExistente) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe un cliente con este ID'
          });
        }
      }

      const nuevoCliente = new Cliente(req.body);
      const clienteGuardado = await nuevoCliente.save();

      res.status(201).json({
        success: true,
        data: clienteGuardado
      });

    } catch (error) {
      console.error('Error en createCliente:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al crear el cliente',
        error: error.message
      });
    }
  }
};

module.exports = clienteController;