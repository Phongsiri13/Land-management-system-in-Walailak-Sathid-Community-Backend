const Joi = require("joi");

// Joi Schema for Citizen Data
const heirSchema = Joi.object({
  prefix_id: Joi.number().integer().min(1).required(),
  first_name: Joi.string().min(3).max(30).required(),
  last_name: Joi.string().min(3).max(30).required(),
});

const heirFullnameSchema = Joi.object({
  first_name: Joi.string().min(3).max(30).required(),
  last_name: Joi.string().min(3).max(30).required(),
});

module.exports = {
  heirSchema,
  heirFullnameSchema
};
