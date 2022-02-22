const express = require('express');

const router = express.Router();

// Middlewares
const { auth } = require('../middlewares');

// Controllers
const { userController } = require('../controllers');

// Create User
router.post(
  '/user',
  userController.register,
);

// Get Users
router.get(
  '/users',
  // auth.isAuth('Admin'),
  userController.get,
);

// Get User
router.get(
  '/user/:id',
  auth.isAuth('Admin'),
  userController.getOne,
);

// Update User
router.patch(
  '/user/:id',
  auth.isAuth('Admin'),
  userController.updateOne,
);

// Delete User
router.delete(
  '/user/:id',
  auth.isAuth('Admin'),
  userController.deleteOne,
);

module.exports = router;
