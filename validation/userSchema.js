const Joi = require("joi");

const userSchema = Joi.object({
    username: Joi.string().min(8).max(30).required(), // ชื่อผู้ใช้ ต้องมี 8-30 ตัวอักษร
    password: Joi.string().min(8).max(255).required(), // รหัสผ่าน 8-255 ตัวอักษร
    user_prefix: Joi.number().integer().allow(null).empty(''), // อนุญาตให้เป็น null หรือค่าว่าง
    first_name: Joi.string().max(30).allow(null).empty(''), // อนุญาตให้เป็นค่าว่าง
    last_name: Joi.string().max(30).allow(null).empty(''), // อนุญาตให้เป็นค่าว่าง
    phone_number: Joi.string().length(10).allow(null).empty('').optional(), // อนุญาตให้เป็นค่าว่างและไม่บังคับกรอก
    id_role: Joi.string().max(4).required(), // id_role ต้องมีค่า
    jwt_token: Joi.string().max(255).allow(null).default(null), // DataType=30, AllowNull=0
    jwt_created_at: Joi.date().iso().allow(null).default(null), // ค่าเริ่มต้นเป็น timestamp ปัจจุบัน
    jwt_expires_at: Joi.date().iso().allow(null).default(null), // อนุญาตให้เป็น null หรือกำหนดค่า timestamp ได้
});

const userPersonalDataUpdateSchema = Joi.object({
    user_prefix: Joi.number().integer().allow(null).empty(''), // อนุญาตให้เป็น null หรือค่าว่าง
    first_name: Joi.string().max(30).allow(null).empty(''), // อนุญาตให้เป็น null หรือค่าว่าง
    last_name: Joi.string().max(30).allow(null).empty(''), // อนุญาตให้เป็น null หรือค่าว่าง
    phone_number: Joi.string().length(10).allow(null).empty('').default(null), // ต้องมีความยาว 10 ตัวอักษร
    id_role: Joi.string().max(4).required(), // ความยาวสูงสุด 4 ตัว
});

const userLoginSchema = Joi.object({
    username: Joi.string().max(30).required(), // DataType=27, LengthSet=30, AllowNull=0
    password: Joi.string().max(30).required(), // DataType=27, LengthSet=255, AllowNull=0    
});

module.exports = {userSchema, userLoginSchema, userPersonalDataUpdateSchema};