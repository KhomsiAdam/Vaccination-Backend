const mongoose = require('mongoose');

const Manager = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  region: {
    type: 'string',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Manager', Manager);
