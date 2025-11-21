const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto'); // Faltaba importar crypto

const userSchema = new Schema({
  id: String,
  rol: Number,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'El email es requerido'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  displayName: {
    type: String,
    required: [true, 'El nombre de usuario es requerido']
  },
  admin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    select: false
  },
  signupDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Método para comparar contraseñas (versión corregida para bcrypt-nodejs)
userSchema.methods.comparePassword = function (candidatePassword) {

  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

// Método para generar avatar con Gravatar
userSchema.methods.gravatar = function (size = 200) {
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }

  const md5 = crypto.createHash("md5").update(this.email).digest("hex");
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

// Método para generar token de reset de contraseña
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);