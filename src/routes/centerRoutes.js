const express = require('express');

const router = express.Router();

// Controllers
const { centerController } = require('../controllers');

// Create User
router.post(
  '/new',
  centerController.add,
);

// Get Users
router.get(
  '/byRegion',
  centerController.get,
);

module.exports = router;
