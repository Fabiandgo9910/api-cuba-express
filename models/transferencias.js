"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

  const transferenciaScheme = Schema({
    id: String,
    idTrajetaEmisor:String,
    idTrajetaDestinatario: String,
    monto: String,
    tasaCambio: String, 
    stado: String,
  });

  module.exports = mongoose.model("Transferencia", transferenciaScheme);
