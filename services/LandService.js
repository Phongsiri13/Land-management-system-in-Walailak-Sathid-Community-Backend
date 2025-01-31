const landModel = require("../model/landModel");
const landSchema = require("../validation/landSchema");

// Mange adding Land
const addLand = async (landData) => {
  try {
    // Logic before sending to db
    console.log("land-data:", landData);
    // ✅ ตรวจสอบข้อมูลด้วย Joi ก่อน
    const { error, value } = landSchema.validate(landData);
    if (error) {
      throw new Error(`Validation Error: ${error.details[0].message}`);
    }

    // Detect total of rai


    // ✅ แปลงค่าตัวเลขให้เป็น float หรือ null (กรณีไม่มีค่า)
    const values = [
      value.tf_number,
      value.spk_area,
      value.number,
      value.volume,
      value.address,
      value.soi,
      parseFloat(value.rai) || null,
      parseFloat(value.ngan) || null,
      parseFloat(value.square_wa) || null,
      value.district,
      value.village,
      value.notation,
      value.land_status,
      value.id_card,
      value.long,
      value.lat,
      1
    ];

    // บันทึกข้อมูลลงฐานข้อมูล
    const result = await landModel.addLand(values);
    console.log("result:",result)
    // แจ้งเตือนเมื่อสำเร็จ
    if (result) {
      // ตรวจสอบว่ามีแถวถูกเพิ่มจริง
      console.log("เพิ่มข้อมูลที่ดินสำเร็จ!");
      return {
        success: true,
        message: "เพิ่มข้อมูลที่ดินสำเร็จ!",
      };
    } else {
      console.log("⚠️ ไม่สามารถเพิ่มข้อมูลได้!");
      return { success: false, message: "ไม่สามารถเพิ่มข้อมูลได้!" };
    }
  } catch (err) {
    throw new Error(`Error adding citizen: ${err.message}`);
  }
};

module.exports = {
  addLand,
};
