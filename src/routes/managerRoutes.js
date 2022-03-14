const express = require('express');

const router = express.Router();

// Middlewares
const { auth } = require('../middlewares');

// Controllers
const { userController } = require('../controllers');

// Validate user
router.post(
  '/validate/:id',
  auth.isAuth('Manager'),
  userController.validate,
);

// Get Users
router.get(
  '/users',
  auth.isAuth('Manager'),
  userController.getByRegion,
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
