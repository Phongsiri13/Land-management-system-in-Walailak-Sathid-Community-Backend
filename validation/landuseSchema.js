const Joi = require("joi");

const landUseSchema = Joi.object({
    land_use_id: Joi.number().integer().required(),
    land_id: Joi.string().required().max(9),
    rubber_tree: Joi.string().valid('0', '1').required(),
    fruit_orchard: Joi.string().valid('0', '1').required(),
    livestock_farming: Joi.string().valid('0', '1').required(),
    other: Joi.string().valid('0', '1').required(),
    details: Joi.string().max(255).allow('')
});

module.exports = {landUseSchema};
