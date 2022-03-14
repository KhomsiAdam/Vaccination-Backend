/*eslint-disable*/

const express = require('express');

const router = express.Router();

// Middlewares
const { auth } = require('../middlewares');

// Models
const { User } = require('../models');

// Controllers
const { userController } = require('../controllers');

// Errors
const LoginError = 'Unable to login.';
const registerError = 'User already exists.';

// Login
router.post(
  '/login',
  auth.validateLogin(LoginError),
  auth.findUserLogin(LoginError, (user) => !user),
  userController.login,
);

// Register
router.post(
  '/register',
  auth.validateUser(),
  auth.findUser(User, registerError, (user) => user, 409),
  userController.register,
);

// Refresh token
router.post(
  '/refresh',
  userController.refresh,
);

// Logout
router.get(
  '/logout',
  userController.logout,
);

// Get Users
router.post(
  '/verify',
  userController.vaccinVerify,
);

// Get user stats
router.get(
  '/stats',userController.stats
);

// Update sideEffects
router.post(
  '/sideeffect',userController.updateEffects
);

// Get appointment
router.post(
  '/appoint',userController.getAppointment
);

// Update to next vaccine
router.post(
  '/vaccine',userController.updateVaccine
);

module.exports = router;
