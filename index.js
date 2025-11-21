"use strict";
const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config")

mongoose.connect("mongodb+srv://fdgo9910_db_user:Fabi.123@fabian.pmm8y8v.mongodb.net/?appName=Fabian", (err, res) => {
  if (err) throw err;
  console.log("consexion exitosa");

  app.listen(config.port, () => {
    console.log("API REST corriendoooooooo");
  });
});
