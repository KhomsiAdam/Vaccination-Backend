const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cin: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
    min: [12, 'You must be 12 years old or older'],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[0-9]+$/, 'Please fill a valid Number phone'],
  },
  zipCode: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  vaccination: {
    type: String,
    enum: ['vaccin1', 'vaccin2', 'vaccin3'],
  },
  region: {
    type: String,
  },
  center: {
    type: String,
  },
  appointment: {
    type: Date,
  },
  SideEffects: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: false,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: false,
  },
}, { timestamps: true });

User.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});
/**
* Methods
*/

User.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', User);
