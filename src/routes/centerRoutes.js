const express = require('express');

const router = express.Router();

// Controllers
const { centerController } = require('../controllers');
const { auth } = require('../middlewares');

// Create User
router.post(
  '/center',
  auth.isAuth('Manager'),
  centerController.add,
);

// Get Users
router.post(
  '/centers',
  centerController.get,
);

module.exports = router;
