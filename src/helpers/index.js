const { logger } = require('./logger');
const { sendMail } = require('./mail');
const { setAccessSecret, setRefreshSecret } = require('./secret');
const { userSchema } = require('./validation');

module.exports = {
  logger,
  sendMail,
  setAccessSecret,
  setRefreshSecret,
  userSchema,
};
