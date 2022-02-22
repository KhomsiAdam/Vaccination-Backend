const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const moment = require('moment');
const { auth } = require('../middlewares');

const { userSchema, setRefreshSecret } = require('../helpers');

const { Role, Admin, User } = require('../models');

// User login
const login = async (req, res, next) => {
  try {
    const result = await bcrypt.compare(
      req.body.password,
      req.user.password,
    );
    if (result) {
      // Set refresh token in cookie
      auth.sendRefreshToken(res, auth.generateRefreshToken(req.user, req.role));
      // Send access token
      res.json({
        token: auth.generateAccessToken(req.user, req.role),
        role: [req.role],
      });
    } else {
      res.status(422);
      throw new Error('Unable to login.');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    next(error);
  }
};

// Refresh access token
const refresh = async (req, res) => {
  // Get refresh token from cookie
  const token = req.cookies.rtkn;
  if (!token) {
    return res.json({ message: false });
  }
  const { role } = jwt.decode(token);
  // Validate refresh token
  let payload = null;
  try {
    const secret = setRefreshSecret(role);
    payload = jwt.verify(token, secret);
  } catch (err) {
    __log.error(err);
    return res.json({ message: false });
  }
  // Get user
  let user;
  switch (role) {
    case 'Admin':
      user = await Admin.findOne({ _id: payload._id });
      break;
    case 'User':
      user = await User.findOne({ _id: payload._id });
      break;
    default:
      user = await User.findOne({ _id: payload._id });
      break;
  }
  if (!user) {
    return res.json({ message: false });
  }
  // Generate new refresh token
  auth.sendRefreshToken(res, auth.generateRefreshToken(user, role));
  // Generate new access token
  const generatedToken = auth.generateAccessToken(user, role);
  return res.json({ token: generatedToken, role: [role] });
};

// Logout user, reset refresh token
const logout = async (res) => {
  // auth.sendRefreshToken(res, '');
  res.clearCookie('rtkn');
  res.json({ message: 'User logged out successfully' });
};

// Verify vaccination
const vaccinVerify = async (req, res) => {
  try {
    const getUser = await User.findOne({ cin: req.body.cin });
    if (!getUser) {
      res.json({ message: 'You are not vaccinated.' });
    } else {
      res.json({
        message: 'You are already vaccinated.',
        vaccine: getUser.vaccination,
      });
    }
  } catch (err) {
    __log.error(err);
  }
};

// Register a user
const register = async (req, res, next) => {
  try {
    // const hashed = await bcrypt.hash(req.body.password, 12);
    const {
      name,
      cin,
      age,
      phone,
      zipCode,
      city,
      address,
      vaccination,
      appointment,
      region,
      center,
      email,
    } = req.body;
    const newUser = new User({
      name,
      cin,
      age,
      phone,
      zipCode,
      city,
      address,
      vaccination,
      appointment,
      region,
      center,
      email,
      // password: hashed,
    });
    await newUser.save();
    // const registeredUser = new Role({
    //   email,
    //   role: User.modelName,
    // });
    // await registeredUser.save();
    res.json({ message: 'User was created successfully.' });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// Get all users (without passwords)
const get = async (req, res, next) => {
  try {
    const result = await User.find().select('-password');
    if (result && result.length > 0) {
      res.json(result);
    } else {
      res.json({ message: 'No users found.' });
    }
  } catch (error) {
    next(error);
  }
};

// Get user by id (without password)
const getOne = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    const query = { _id };
    const user = await User.findOne(query).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.json({ message: 'No user found.' });
    }
  } catch (error) {
    next(error);
  }
};

// Update user
const updateOne = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    const result = userSchema.validate(req.body);
    if (!result.error) {
      const query = { _id };
      const user = await User.findOne(query);
      if (user) {
        const updatedUser = req.body;
        if (updatedUser.password) {
          updatedUser.password = await bcrypt.hash(updatedUser.password, 12);
        }
        const response = await User.findOneAndUpdate(query, {
          $set: updatedUser,
        }, { new: true }).select('-password');
        await Role.updateOne({ email: user.email }, { email: response.email });
        res.json(response);
      } else {
        next({ message: 'No user found.' });
      }
    } else {
      res.status(422);
      __log.error(result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    next(error);
  }
};

// Delete user by id
const deleteOne = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    const query = { _id };
    const user = await User.findOne(query);
    if (user) {
      const response = await User.findOneAndDelete(query);
      await Role.deleteOne({ email: response.email });
      res.json(response);
    } else {
      next({ message: 'No user found.' });
    }
  } catch (error) {
    next(error);
  }
};

// Get statistics
const stats = async (req, res, next) => {
  try {
    const vaccin1 = await User.countDocuments({ vaccination: 'vaccin1' }).exec();
    const vaccin2 = await User.countDocuments({ vaccination: 'vaccin2' }).exec();
    const vaccin3 = await User.countDocuments({ vaccination: 'vaccin3' }).exec();

    res.json({
      vaccin1,
      vaccin2,
      vaccin3,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  getOne,
  login,
  refresh,
  register,
  logout,
  updateOne,
  deleteOne,
  vaccinVerify,
  stats,
};
