'use strict';

const mongoose = require('mongoose');
const Cuenta = require('../models/cuenta');

/**
 * Controlador para operaciones CRUD de cuentas
 */
const cuentaController = {

  /**
   * Obtiene una cuenta por ID personalizado
   */
  async getCuenta(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el parámetro ID'
        });
      }

      const cuenta = await Cuenta.findOne({ id });

      if (!cuenta) {
        return res.status(404).json({
          success: false,
          message: 'Cuenta no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: cuenta
      });

    } catch (error) {
      console.error('Error en getCuenta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la cuenta',
        error: error.message
      });
    }
  },

  /**
   * Obtiene todas las cuentas
   */
  async getAllCuentas(req, res) {
    try {
      const cuentas = await Cuenta.find({});

      res.status(200).json({
        success: true,
        count: cuentas.length,
        data: cuentas
      });

    } catch (error) {
      console.error('Error en getCuentas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las cuentas',
        error: error.message
      });
    }
  },

  /**
   * Actualiza una cuenta por ID personalizado
   */
  async updateCuenta(req, res) {
    try {
      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el campo ID en el body'
        });
      }

      const cuentaActualizada = await Cuenta.findOneAndUpdate(
        { id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!cuentaActualizada) {
        return res.status(404).json({
          success: false,
          message: 'Cuenta no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: cuentaActualizada
      });

    } catch (error) {
      console.error('Error en updateCuenta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar la cuenta',
        error: error.message
      });
    }
  },

  /**
   * Elimina una cuenta por ID personalizado
   */
  async deleteCuenta(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el campo ID en el body'
        });
      }

      const cuentaEliminada = await Cuenta.findOneAndDelete({ id });

      if (!cuentaEliminada) {
        return res.status(404).json({
          success: false,
          message: 'Cuenta no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Cuenta eliminada correctamente',
        data: cuentaEliminada
      });

    } catch (error) {
      console.error('Error en deleteCuenta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la cuenta',
        error: error.message
      });
    }
  },

  /**
   * Crea una nueva cuenta
   */
  async createCuenta(req, res) {
    console.log(req);
    
    try {
      const { id } = req.body;

      // Validar si la cuenta ya existe
      if (id) {
        const cuentaExistente = await Cuenta.findOne({ id });
        if (cuentaExistente) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe una cuenta con este ID'
          });
        }
      }

      const nuevaCuenta = new Cuenta(req.body);
      const cuentaGuardada = await nuevaCuenta.save();

      res.status(201).json({
        success: true,
        data: cuentaGuardada
      });

    } catch (error) {
      console.error('Error en createCuenta:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al crear la cuenta',
        error: error.message
      });
    }
  }
};

module.exports = cuentaController;