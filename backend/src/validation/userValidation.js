const Joi = require('joi');

const insertUserSchema = Joi.object({
  userName: Joi.string().trim().min(3).max(100).required(),
  password: Joi.string().min(6).max(100).required(),
  roleId: Joi.number().integer().positive().required(),
  status: Joi.number().integer().valid(1, 2).default(1).optional(),
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

const updateUserSchema = Joi.object({
  userName: Joi.string().trim().min(3).max(100).optional(),
  password: Joi.string().min(6).max(100).optional(),
  roleId: Joi.number().integer().positive().optional(),
  status: Joi.number().integer().valid(1, 2).optional(),
});

module.exports = { insertUserSchema, getUsersQuerySchema, searchUsersSchema, updateUserSchema };
