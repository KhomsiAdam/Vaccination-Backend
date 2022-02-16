/*eslint-disable*/

const express = require('express');

const router = express.Router();

// Middlewares
// const { auth } = require('../middlewares');

// Controllers
const { userController } = require('../controllers');


//create User
router.post(
  '/new',
  userController.register,
);
// Get Users
router.get(
  '/all',
  userController.get,
);

// Get Users
router.get(
    '/vaccinVerify',
    userController.vaccinVerify,
  );


// Update User
router.patch(
  '/user/:id',
//   auth.isAuth('Admin'),
  userController.updateOne,
);

// Delete User
router.delete(
  '/user/:id',
  userController.deleteOne,
);

module.exports = router;
