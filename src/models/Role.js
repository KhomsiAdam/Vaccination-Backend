const mongoose = require('mongoose');

const Role = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Role', Role);
