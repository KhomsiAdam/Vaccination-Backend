const Joi = require('joi');

// Login schema for validation
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .trim(),

  password: Joi.string()
    .trim()
    .min(10),
});

// User schema for validation
const userSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required(),

  cin: Joi.string()
    .trim()
    .required(),

  age: Joi.number()
    .required(),

  phone: Joi.string()
    .trim()
    .required(),

  zipCode: Joi.string()
    .trim()
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
    .trim(),

  password: Joi.string()
    .trim()
    .min(10),
});

module.exports = {
  loginSchema,
  userSchema,
};
