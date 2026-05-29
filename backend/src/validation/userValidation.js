const Joi = require('joi');

const insertUserSchema = Joi.object({
  userName: Joi.string().trim().min(3).max(100).required(),
  password: Joi.string().min(6).max(100).required(),
  roleId: Joi.number().integer().positive().required(),
});

const getUsersQuerySchema = Joi.object({
  userName: Joi.string().trim().max(100).allow(''),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
});

const searchUsersSchema = Joi.object({
  userName: Joi.string().trim().max(100).allow(''),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = { insertUserSchema, getUsersQuerySchema, searchUsersSchema };
