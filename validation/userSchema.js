const Joi = require("joi");

const userSchema = Joi.object({
    username: Joi.string().max(30).required(), // DataType=27, LengthSet=30, AllowNull=0
    password: Joi.string().min(8).max(255).required(), // DataType=27, LengthSet=255, AllowNull=0
    user_prefix: Joi.number().integer().max(1).allow(null), // DataType=3, LengthSet=1, AllowNull=1
    first_name: Joi.string().max(30).allow(null), // DataType=27, LengthSet=30, AllowNull=1
    last_name: Joi.string().max(30).allow(null), // DataType=27, LengthSet=30, AllowNull=1
    phone_number: Joi.string().length(10).allow(null), // DataType=27, LengthSet=10, AllowNull=1
    id_role: Joi.string().max(4).required(), // DataType=27, LengthSet=4, AllowNull=0
    jwt_token: Joi.string().max(255).allow(null).default(null), // DataType=30, AllowNull=0
    jwt_created_at: Joi.date().iso().allow(null).default(null), // ค่าเริ่มต้นเป็น timestamp ปัจจุบัน
    jwt_expires_at: Joi.date().iso().allow(null).default(null), // อนุญาตให้เป็น null หรือกำหนดค่า timestamp ได้
    // created_at: Joi.date().iso().default(() => new Date().toISOString()), // DataType=19, DefaultType=4 (current_timestamp)
});

const userLoginSchema = Joi.object({
    username: Joi.string().max(30).required(), // DataType=27, LengthSet=30, AllowNull=0
    password: Joi.string().max(30).required(), // DataType=27, LengthSet=255, AllowNull=0    
});

module.exports = {userSchema, userLoginSchema};