"use strict";
const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config")

mongoose.connect("mongodb+srv://fdgo9910_db_user:Fabi.123@fabian.pmm8y8v.mongodb.net/?appName=Fabian", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true, // Asegúrate de que SSL esté habilitado
})
  .then(() => {
    console.log('Conectado a la base de datos MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);


    app.listen(8080, () => {
      console.log("API REST corriendoooooooo");
    });
  });
