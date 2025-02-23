const Joi = require("joi");

// Joi Schema for Citizen Data
const citizenSchema = Joi.object({
  citizenId: Joi.string().length(13).pattern(/^\d+$/).required(), // 13-digit numeric string
  first_name: Joi.string().min(3).max(30).required(),
  last_name: Joi.string().min(3).max(30).required(),
  prefix_id: Joi.number().integer().min(1).required(),
  birthday: Joi.date().iso().required(), // ISO format date (YYYY-MM-DD)
  house_number: Joi.string().max(10).required(),
  village_number: Joi.string().max(2).pattern(/^\d+$/).required(), // Must be a numeric string
  district: Joi.string().max(100).required(),
  soi: Joi.number().max(13).allow(null, ""), // Allow null or empty string
  phone_number: Joi.string().length(10).pattern(/^\d+$/).required(), // 10-digit numeric string
  gender: Joi.string().valid("0", "1").required()
})

module.exports = citizenSchema;
