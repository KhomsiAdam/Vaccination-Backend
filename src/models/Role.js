/* eslint-disable*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Role = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true ,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  role: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Role', Role);
