const jwt = require('jsonwebtoken');

const {
  userSchema,
  loginSchema,
  setAccessSecret,
  setRefreshSecret,
} = require('../helpers');

const {
  Role,
  Admin,
  User,
  Manager,
} = require('../models');

// Access Token generation when login
const generateAccessToken = (user, userRole) => {
  const payload = {
    _id: user._id,
    email: user.email,
    role: userRole,
    region: user.region ? user.region : null,
  };
  return jwt.sign(
    payload,
    setAccessSecret(userRole),
    { expiresIn: '15min' },
  );
};

// Refresh Token generation when login
const generateRefreshToken = (user, userRole) => {
  const payload = {
    _id: user._id,
    email: user.email,
    role: userRole,
    region: user.region ? user.region : null,
  };
  return jwt.sign(
    payload,
    setRefreshSecret(userRole),
    { expiresIn: '7d' },
  );
};

// Send refresh token and set to coookie
const sendRefreshToken = (res, token) => {
  res.cookie(
    'rtkn',
    token,
    {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      path: '/refresh',
    },
  );
};

// Unauthorized error
const unAuthorized = (res, next) => {
  const error = new Error('Unauthorized.');
  res.status(401);
  next(error);
};

// Is authenticated middleware
const isAuth = (role) => (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, setAccessSecret(role), (error, user) => {
        if (error) {
          res.setHeader('Content-Type', 'application/json');
          res.status(403);
          next(error);
        }
        req.user = user;
        next();
      });
    } else {
      unAuthorized(res, next);
    }
  } else {
    unAuthorized(res, next);
  }
};

// Is logged in
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    unAuthorized(res, next);
  }
};

// User validation
const validateUser = (defaultErrorMessage = '') => (req, res, next) => {
  console.log(req.body);

  const result = userSchema.validate(req.body);
  if (!result.error) {
    next();
  } else {
    const error = defaultErrorMessage ? new Error(defaultErrorMessage) : result.error;
    res.status(422);
    next(error);
  }
};
const validateLogin = (defaultErrorMessage = '') => (req, res, next) => {
  const result = loginSchema.validate(req.body);
  if (!result.error) {
    next();
  } else {
    const error = defaultErrorMessage ? new Error(defaultErrorMessage) : result.error;
    res.status(422);
    next(error);
  }
};

// Find user with provided credentials
const findUser = (Model, defaultLoginError, isError, errorCode = 422) => async (req, res, next) => {
  try {
    const user = await Model.findOne({
      email: req.body.email,
    }, 'email password');
    if (isError(user)) {
      res.status(errorCode);
      next(new Error(defaultLoginError));
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// Find user with provided credentials
const findUserLogin = (defaultLoginError, isError, errorCode = 422) => async (req, res, next) => {
  try {
    const fetchedUser = await Role.findOne({
      email: req.body.email,
    }, 'email role');
    console.log('test');
    if (isError(fetchedUser)) {
      res.status(errorCode);
      next(new Error(defaultLoginError));
    } else {
      req.role = fetchedUser.role;
      switch (fetchedUser.role) {
        case 'Admin':
          req.user = await Admin.findOne({ email: req.body.email }, 'email password');
          next();
          break;
        case 'User':
          req.user = await User.findOne({ email: req.body.email }, 'email password');
          next();
          break;
        case 'Manager':
          req.user = await Manager.findOne({ email: req.body.email }, 'email password region');
          next();
          break;
        default:
          req.user = await User.findOne({ email: req.body.email }, 'email password');
          next();
          break;
      }
    }
  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = {
  isAuth,
  isLoggedIn,
  validateUser,
  validateLogin,
  findUser,
  findUserLogin,
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
};
