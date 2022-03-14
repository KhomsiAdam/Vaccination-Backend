/* eslint-disable no-unused-vars */

const { Centers } = require('../models');

// added new center
const add = async (req, res, next) => {
  try {
    // const hashed = await bcrypt.hash(req.body.password, 12);
    const {
      center, region,
    } = req.body;
    const newCenter = new Centers({
      center,
      region,
    });
    await newCenter.save();
    res.json({ message: 'Center was created successfully.' });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// Get all centers (with region)
const get = async (req, res, next) => {
  try {
    const result = await Centers.find({ region: req.body.region }).select('center');
    if (result && result.length > 0) {
      res.json(result);
    } else {
      res.json({ message: 'No centers found.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  add,
};
