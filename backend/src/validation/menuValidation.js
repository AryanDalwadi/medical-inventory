const Joi = require('joi');

const insertMainMenuSchema = Joi.object({
  label: Joi.string().trim().min(2).max(100).required(),
  icon: Joi.string().trim().max(100).required(),
  url: Joi.string().trim().max(255).required(),
  priority_id: Joi.number().integer().min(0).default(0).optional(),
  status: Joi.number().integer().valid(1, 2).default(1).optional(),
  expandable: Joi.boolean().default(false).optional(),
  sys_admin: Joi.boolean().default(false).optional(),
});

const updateMainMenuSchema = Joi.object({
  label: Joi.string().trim().min(2).max(100).optional(),
  icon: Joi.string().trim().max(100).optional(),
  url: Joi.string().trim().max(255).optional(),
  priority_id: Joi.number().integer().min(0).optional(),
  status: Joi.number().integer().valid(1, 2).optional(),
  expandable: Joi.boolean().optional(),
  sys_admin: Joi.boolean().optional(),
});

const insertSubMenuSchema = Joi.object({
  main_menu_id: Joi.string().uuid().required(),
  sub_menu_label: Joi.string().trim().min(2).max(100).required(),
  icon: Joi.string().trim().max(100).required(),
  url: Joi.string().trim().max(255).required(),
  sp1_details: Joi.string().trim().max(255).allow('', null).optional(), // Let's make details optional or allow empty to prevent user blockages, but Joi validated
  sp2_details: Joi.string().trim().max(255).allow('', null).optional(),
  priority_id: Joi.number().integer().min(0).default(0).optional(),
  status: Joi.number().integer().valid(1, 2).default(1).optional(),
  sys_admin: Joi.boolean().default(false).optional(),
});

const updateSubMenuSchema = Joi.object({
  main_menu_id: Joi.string().uuid().optional(),
  sub_menu_label: Joi.string().trim().min(2).max(100).optional(),
  icon: Joi.string().trim().max(100).optional(),
  url: Joi.string().trim().max(255).optional(),
  sp1_details: Joi.string().trim().max(255).allow('', null).optional(),
  sp2_details: Joi.string().trim().max(255).allow('', null).optional(),
  priority_id: Joi.number().integer().min(0).optional(),
  status: Joi.number().integer().valid(1, 2).optional(),
  sys_admin: Joi.boolean().optional(),
});

module.exports = {
  insertMainMenuSchema,
  updateMainMenuSchema,
  insertSubMenuSchema,
  updateSubMenuSchema,
};
