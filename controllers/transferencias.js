'use strict';

const Transferencia = require('../models/transferencias');

/**
 * Controlador para operaciones CRUD de transferencias
 */
const transferenciaController = {

  /**
   * Obtiene una transferencia por ID
   */
  async getTransferencia(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el parámetro ID'
        });
      }

      const transferencia = await Transferencia.findOne({ id }); // Cambiado a findOne para usar el id personalizado

      if (!transferencia) {
        return res.status(404).json({
          success: false,
          message: 'Transferencia no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: transferencia
      });

    } catch (error) {
      console.error('Error en getTransferencia:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la transferencia',
        error: error.message
      });
    }
  },

  /**
   * Obtiene todas las transferencias
   */
  async getTransferencias(req, res) {
    try {
      const transferencias = await Transferencia.find({});

      res.status(200).json({
        success: true,
        count: transferencias.length,
        data: transferencias
      });

    } catch (error) {
      console.error('Error en getTransferencias:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las transferencias',
        error: error.message
      });
    }
  },

  /**
   * Actualiza una transferencia por ID
   */
  async updateTransferencia(req, res) {
    try {
      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el campo ID en el body'
        });
      }

      const transferenciaActualizada = await Transferencia.findOneAndUpdate(
        { id }, // Buscar por id personalizado
        updateData,
        { new: true, runValidators: true }
      );

      if (!transferenciaActualizada) {
        return res.status(404).json({
          success: false,
          message: 'Transferencia no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: transferenciaActualizada
      });

    } catch (error) {
      console.error('Error en updateTransferencia:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar la transferencia',
        error: error.message
      });
    }
  },

  /**
   * Elimina una transferencia por ID
   */
  async deleteTransferencia(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el campo ID en el body'
        });
      }

      const transferenciaEliminada = await Transferencia.findOneAndDelete({ id });

      if (!transferenciaEliminada) {
        return res.status(404).json({
          success: false,
          message: 'Transferencia no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Transferencia eliminada correctamente',
        data: transferenciaEliminada
      });

    } catch (error) {
      console.error('Error en deleteTransferencia:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la transferencia',
        error: error.message
      });
    }
  },

  /**
   * Crea una nueva transferencia
   */
  async createTransferencia(req, res) {
    try {
      // Verificar que el body no esté vacío
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'El cuerpo de la solicitud no puede estar vacío'
        });
      }

      const { id, idTrajetaEmisor, idTrajetaDestinatario, monto, tasaCambio, stado } = req.body;

      // Validación de campos requeridos
      if (!id || !idTrajetaEmisor || !idTrajetaDestinatario || !monto) {
        return res.status(400).json({
          success: false,
          message: 'Los campos id, idTrajetaEmisor, idTrajetaDestinatario y monto son requeridos'
        });
      }

      // Verificar si la transferencia ya existe
      const transferenciaExistente = await Transferencia.findOne({ id });
      if (transferenciaExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una transferencia con este ID'
        });
      }

      const nuevaTransferencia = new Transferencia({
        id,
        idTrajetaEmisor,
        idTrajetaDestinatario,
        monto,
        tasaCambio: tasaCambio || "1.0", // Valor por defecto para tasa de cambio
        stado: stado || "pendiente" // Valor por defecto para estado
      });

      const transferenciaGuardada = await nuevaTransferencia.save();

      res.status(201).json({
        success: true,
        data: transferenciaGuardada
      });

    } catch (error) {
      console.error('Error en createTransferencia:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al crear la transferencia',
        error: error.message
      });
    }
  }
};

module.exports = transferenciaController;