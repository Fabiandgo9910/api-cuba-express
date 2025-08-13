'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cuentaScheme = Schema({
  id: String,
  noCuenta: String,
  monto: Number,
  banco: String,
  origen: String, // Pais o persona  para identificar roles
  nombreTitular: String,
  rut:String,
  tipo: String, // natural O de Empresa
  moneda: String,
});

module.exports = mongoose.model('Cuenta', cuentaScheme);
