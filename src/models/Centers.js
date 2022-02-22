const mongoose = require('mongoose');

const Centers = mongoose.Schema({
  center: {
    type: 'string',
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Centers', Centers);
