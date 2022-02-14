// Setup the global Winston logger
global.__log = require('../helpers/logger');

// ENV Variables
require('dotenv').config();

// Express App
const express = require('express');

const app = express();

// Middlewares (import)
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const {
  morgan,
  notFound,
  errorHandler,
  auth,
} = require('../middlewares');

// Models
const { User } = require('../models');

// Controllers
const { userController } = require('../controllers');

// Errors
const LoginError = 'Unable to login.';
const registerError = 'User already exists with this email.';

// Routes
const { adminRoutes } = require('../routes');

// Middlewares (use)
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan);

// Hello World
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
    user: req.cookies.rtkn,
  });
});

// Login
app.post(
  '/login',
  auth.validateUser(LoginError),
  auth.findUserLogin(LoginError, (user) => !user),
  userController.login,
);

// Register
app.post(
  '/register',
  auth.validateUser(),
  auth.findUser(User, registerError, (user) => user, 409),
  userController.register,
);

// Refresh token
app.post(
  '/refresh',
  userController.refresh,
);

// Logout
app.get(
  '/logout',
  userController.logout,
);

// Endpoints
app.use('/admin', adminRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
