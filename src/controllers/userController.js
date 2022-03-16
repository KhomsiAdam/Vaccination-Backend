const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generator = require('generate-password');
const { auth } = require('../middlewares');

const { userSchema, setRefreshSecret, sendMail } = require('../helpers');

const {
  Role,
  Admin,
  Manager,
  User,
  Vaccination,
} = require('../models');

// Password generator

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
    case 'Manager':
      user = await Manager.findOne({ _id: payload._id });
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
const logout = async (req, res) => {
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
    const status = new Vaccination({
      cin,
      vaccine1: true,
    });
    await status.save();
    sendMail({ email, appointment });
    res.json({ message: 'User was created successfully.' });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// Create a manager
const createManager = async (req, res, next) => {
  const { email, region } = req.body;
  // Generate a random password
  const password = generator.generate({
    length: 10,
    numbers: true,
  });
  console.log(password);
  // Send email with credentials
  sendMail({ email, password });
  // Hash password then create the user
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new Manager({
        email,
        password: hashedPw,
        region,
      });
      user.save();
      const registeredUser = new Role({
        email,
        role: Manager.modelName,
      });
      registeredUser.save();
      res.json({ message: 'Manager was created successfully.' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        // eslint-disable-next-line no-param-reassign
        err.statusCode = 500;
      }
      next(err);
    });
};

// Validate user vaccination
const validate = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const query = { _id };
    const response = await User.findOneAndUpdate(query, {
      $set: { status: 'NotVaccinated' },
    }, { new: true }).select('-password');
    res.json(response);
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

// Get all users (without passwords)
const getByRegion = async (req, res, next) => {
  try {
    const result = await User.find({ region: req.user.region }).select('-password');
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

// Update next vaccine
const updateVaccine = async (req, res, next) => {
  const { id: _id } = req.params;
  const query = { _id };
  try {
    const updatedUser = { vaccination: req.body.vaccination, appointment: req.body.appointment };
    const response = await User.findOneAndUpdate(query, {
      $set: updatedUser,
    }, { new: true }).select('-password');
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Update side effect
const updateEffects = async (req, res, next) => {
  try {
    const user = await User.findOne({ cin: req.body.cin });
    if (user) {
      const updatedUser = { SideEffects: req.body.SideEffects, appointment: req.body.appointment };
      const response = await User.findOneAndUpdate({ cin: req.body.cin }, {
        $set: updatedUser,
      }, { new: true }).select('-password');
      let sideEffectStatus;
      if (response.vaccination === 'vaccin1') {
        sideEffectStatus = { sideEffect1: 'true' };
      } else if (response.vaccination === 'vaccin2') {
        sideEffectStatus = { sideEffect2: 'true' };
      }
      const status = await Vaccination.findOneAndUpdate({ cin: req.body.cin }, {
        $set: sideEffectStatus,
      }, { new: true });
      await status.save();
      console.log(response);
      res.json(response);
    } else {
      next({ message: 'No user found.' });
    }
  } catch (error) {
    next(error);
  }
};

// Update side effect
const getAppointment = async (req, res, next) => {
  try {
    const user = await User.findOne({ cin: req.body.cin });
    if (user) {
      console.log(user.appointment);
      res.json(user);
    } else {
      next({ message: 'No user found.' });
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
    const vaccine1 = await Vaccination.countDocuments({ vaccine1: true }).exec();
    const vaccine2 = await Vaccination.countDocuments({ vaccine2: true }).exec();
    const vaccine3 = await Vaccination.countDocuments({ vaccine3: true }).exec();

    res.json({
      vaccine1,
      vaccine2,
      vaccine3,
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
  updateEffects,
  getAppointment,
  createManager,
  validate,
  getByRegion,
  updateVaccine,
};
