const Joi = require('joi');
/*eslint linebreak-style: ["error", "windows"]*/

// User schema for validation
const userSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .trim()
    .required(),

  password: Joi.string()
    .trim()
    .min(10)
    .required(),
});

module.exports = {
  userSchema,
};
