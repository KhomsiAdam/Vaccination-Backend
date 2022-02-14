const errorHandler = require('./errorHandler');
const notFound = require('./notFound');
const morgan = require('./morgan');
const auth = require('./auth');

module.exports = {
  errorHandler,
  notFound,
  morgan,
  auth,
};
