const mongoose = require('mongoose');

const Admin = mongoose.Schema({
  region: {
    type: 'string',
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Admin', Admin);
