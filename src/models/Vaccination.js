const mongoose = require('mongoose');

const Vaccination = mongoose.Schema({
  cin: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  vaccine1: {
    type: Boolean,
    default: false,
  },
  vaccine2: {
    type: Boolean,
    default: false,
  },
  vaccine3: {
    type: Boolean,
    default: false,
  },
  sideEffect1: {
    type: Boolean,
    default: false,
  },
  sideEffect2: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Vaccination', Vaccination);
