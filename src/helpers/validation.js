const Joi = require('joi');

// User schema for validation
const userSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required(),

  cin: Joi.string()
    .trim()
    .required(),

  age: Joi.date()
    .required(),

  phone: Joi.number()
    .required(),

  zipCode: Joi.number()
    .required(),

  city: Joi.string()
    .trim()
    .required(),

  address: Joi.string()
    .trim()
    .required(),

  vaccination: Joi.string()
    .valid('vaccin1', 'vaccin2', 'vaccin3')
    .trim()
    .required(),

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
