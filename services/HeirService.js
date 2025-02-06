const heirModel = require("../model/heirModel");
const heirSchema = require("../validation/heirSchema");

// Mange adding Heir
const addHeir = async (data) => {
  const heirData = data;
  try {
    // validation
    console.log("heir-data:", heirData);
    // ✅ ตรวจสอบข้อมูลด้วย Joi ก่อน
    const { error, value } = heirSchema.validate(heirData);
    if (error) {
      throw new Error(`Validation Error: ${error.details[0].message}`);
    }

    const values = [value.first_name, value.last_name, value.prefix_id];
    const result = await heirModel.addHeir(values);
    return result;
  } catch (err) {
    throw new Error(`Error adding citizen: ${err.message}`);
  }
};

module.exports = {
  addHeir,
};
