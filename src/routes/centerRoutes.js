const express = require('express');

const router = express.Router();

// Controllers
const { centerController } = require('../controllers');

// Create User
router.post(
  '/center',
  centerController.add,
);

// Get Users
router.post(
  '/centers',
  centerController.get,
);

module.exports = router;
