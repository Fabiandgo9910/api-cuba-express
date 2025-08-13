'use strict';

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Verificar si el email y password existen
  if (!email || !password) {
    return next(new AppError('Por favor provea email y contraseña', 400));
  }

  // 2) Verificar si el usuario existe y la contraseña es correcta
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email o contraseña incorrectos', 401));
  }

  // 3) Si todo está bien, enviar token al cliente
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});