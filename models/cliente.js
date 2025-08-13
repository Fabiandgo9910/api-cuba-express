"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clienteScheme = Schema({
  id: String,
  nombre:String,
  idsCuentas: Object,
  idsCuentasDestino: Object,
  telefono: String, 
  potencial: String,
});

module.exports = mongoose.model("Cliente", clienteScheme);
