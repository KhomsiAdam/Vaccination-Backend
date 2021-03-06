/*eslint-disable*/
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
} = require('../middlewares');

// Routes
const { userRoutes, adminRoutes, managerRoutes, centerRoutes } = require('../routes');

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

// Endpoints
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);
app.use(userRoutes);
app.use(centerRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
