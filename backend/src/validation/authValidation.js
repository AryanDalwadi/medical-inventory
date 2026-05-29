const Joi = require('joi');

const loginSchema = Joi.object({
  userName: Joi.string().trim().min(3).max(100).required(),
  password: Joi.string().min(6).max(100).required(),
});

module.exports = { loginSchema };
