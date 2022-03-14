const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const logger = require('../helpers/logger');
require('dotenv').config();

const { Role, Manager } = require('../models');

const {
  DB_USER, DB_PASS, DB_CLUSTER, DB_NAME,
} = process.env;

const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const seedManagers = () => {
  mongoose.connect(DB_URI, async () => {
    try {
      await Manager.collection.drop();
      const hashedPassword = await bcrypt.hash('manager123**', 12);
      const admins = await Manager.create([
        {
          region: 'Marrakech-Safi',
          email: 'manager-ms@covid.com',
          password: hashedPassword,
        },
        {
          region: 'Casablanca-Settat',
          email: 'manager-cs@covid.com',
          password: hashedPassword,
        },
      ]);
      await Role.collection.drop();
      await Role.create([
        {
          email: 'manager-ms@covid.com',
          role: 'Manager',
        },
        {
          email: 'manager-cs@covid.com',
          role: 'Manager',
        },
      ]);
      if (admins) {
        logger.info('Managers created!');
        mongoose.disconnect();
      } else {
        logger.info('Managers already exists!');
        mongoose.disconnect();
      }
    } catch (error) {
      logger.error(error);
      mongoose.disconnect();
    }
  });
};

seedManagers();
