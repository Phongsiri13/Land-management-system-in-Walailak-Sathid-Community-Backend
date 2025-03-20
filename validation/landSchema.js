const Joi = require("joi");

const landSchema = Joi.object({
  tf_number: Joi.string().required().max(5), // รหัสแปลงที่ดิน (string)
  spk_area: Joi.string().required().max(11), // พื้นที่ ส.ป.ก. (string)
  number: Joi.string().required().max(5), // หมายเลข (string)
  volume: Joi.string().required().max(5), // ปริมาณ (string)
  address: Joi.string().required().max(6), // ที่อยู่ (string)
  soi: Joi.number().integer().min(0).max(13).required(), // ซอย (number, ต้องเป็นจำนวนเต็มบวก)
  rai: Joi.number().integer().min(0).max(5), // ไร่ (0-5 ไร่)
  ngan: Joi.number().integer().min(0).max(3.9999), // งาน (0-3 งาน)
  square_wa: Joi.number().integer().min(0).max(99.9999), // ตารางวา (0-99 ตารางวา)
  district: Joi.string(), // อำเภอ (string)
  village: Joi.string().pattern(/^\d+$/).messages({
    "string.pattern.base": "หมู่บ้าน ต้องเป็นตัวเลขเท่านั้น",
  }),
  long: Joi.number().min(-190).max(190).allow(null), // Validate longitude if needed
  lat: Joi.number().min(-90).max(90).allow(null), // Validate latitude if needed
  // หมู่บ้าน (string)
  notation: Joi.string().allow("").optional(), // บันทึกเพิ่มเติม (string, ไม่บังคับ)
  land_status: Joi.string().max(6).required(), // สถานะที่ดิน (number)
  id_card: Joi.string()
    .length(13)
    .pattern(/^\d{13}$/)
    .required(), // บัตรประชาชน (13 หลัก)
});

// verify land schema
const validateLandData = (landData) => {
  const { error, value } = landSchema.validate(landData);
  if (error) {
    // สร้างข้อผิดพลาดแบบ Custom
    const validationError = new Error("ข้อมูลที่เพิ่มเข้ามาไม่ถูกต้อง!");
    validationError.name = "ValidationError"; // ตั้งค่า error.name
    validationError.statusCode = 400;
    validationError.details = error.details; // รายละเอียดข้อผิดพลาดจาก Joi
    throw validationError; // โยนข้อผิดพลาดออกไป
  }
  return value; // คืนค่าข้อมูลที่ถูกต้อง
};

const forceLandSchema = Joi.object({
  tf_number: Joi.string().required().max(5), // รหัสแปลงที่ดิน (string)
  spk_area: Joi.string().required().max(11), // พื้นที่ ส.ป.ก. (string)
  number: Joi.string().required().max(5), // หมายเลข (string)
  volume: Joi.string().required().max(5), // ปริมาณ (string)
  address: Joi.string().max(6), // ที่อยู่ (string)
  soi: Joi.number().integer().min(0).max(13).required(), // ซอย (number, ต้องเป็นจำนวนเต็มบวก)
  rai: Joi.number().integer().min(0).max(5), // ไร่ (0-5 ไร่)
  ngan: Joi.number().integer().min(0).max(3.9999), // งาน (0-3 งาน)
  square_wa: Joi.number().integer().min(0).max(99.9999), // ตารางวา (0-99 ตารางวา)
  district: Joi.string(), // อำเภอ (string)
  village: Joi.string().pattern(/^\d+$/).messages({
    "string.pattern.base": "หมู่บ้าน ต้องเป็นตัวเลขเท่านั้น",
  }),
  long: Joi.number().min(-190).max(190).allow(null), // Validate longitude if needed
  lat: Joi.number().min(-90).max(90).allow(null), // Validate latitude if needed
  // หมู่บ้าน (string)
  notation: Joi.string().allow("").optional(), // บันทึกเพิ่มเติม (string, ไม่บังคับ)
  land_status: Joi.string().max(6).required(), // สถานะที่ดิน (number)
  id_card: Joi.string()
    .length(13)
    .pattern(/^\d{13}$/)
    .required(), // บัตรประชาชน (13 หลัก)
});

module.exports = { landSchema, forceLandSchema, validateLandData };
