const landModel = require("../model/landModel");
const landSchemaCheck = require("../validation/landSchema");
const { landUseSchema } = require("../validation/landuseSchema");

// SV = service

// Mange adding Land
const addLand = async (landData) => {
  try {
    // Logic before sending to db
    console.log("land-data:", landData);

    // ตรวจสอบข้อมูลด้วย validateLandData
    const validatedData = landSchemaCheck.validateLandData(landData);

    // ✅ แปลงค่าตัวเลขให้เป็น float หรือ null (กรณีไม่มีค่า)
    const values = [
      validatedData.tf_number,
      validatedData.spk_area,
      validatedData.number,
      validatedData.volume,
      validatedData.address,
      validatedData.soi,
      validatedData.rai ? parseFloat(validatedData.rai) : null, // แปลง rai เป็น float หรือ null
      validatedData.ngan ? parseFloat(validatedData.ngan) : null, // แปลง ngan เป็น float หรือ null
      validatedData.square_wa ? parseFloat(validatedData.square_wa) : null, // แปลง square_wa เป็น float หรือ null
      validatedData.district,
      validatedData.village,
      validatedData.notation,
      validatedData.land_status,
      validatedData.id_card,
      validatedData.long,
      validatedData.lat,
      "1", // ค่า default หรือค่าอื่น ๆ ตามต้องการ
    ];

    // บันทึกข้อมูลลงฐานข้อมูล
    const result = await landModel.addLand(values);
    console.log("result:", result);

    // // ตรวจสอบ statusCode ของผลลัพธ์
    // if (result.status.statusCode === 200) {
    //   return result; // คืนค่าผลลัพธ์หากสำเร็จ
    // }
    // if (result.status.statusCode === 409) {
    //   return result; // คืนค่าผลลัพธ์หากมีข้อผิดพลาด (เช่น ข้อมูลซ้ำ)
    // }

    // คืนค่าผลลัพธ์โดยทั่วไป
    return result;
  } catch (err) {
    console.log("err:", err);
    throw {
      statusCode: err.statusCode || 500, // ใช้ 500 หากไม่มี statusCode
      message: `${err.message}`,
      details: err.details || null, // รายละเอียดข้อผิดพลาด (ถ้ามี)
    };
  }
};

const UpdateLand = async (landData, id) => {
  try {
    // Logic before sending to db
    console.log("land-data:", landData);
    // ตรวจสอบข้อมูลด้วย Joi ก่อน
    const { error, value } = landSchemaCheck.forceLandSchema.validate(landData);
    if (error) {
      throw new Error(`Validation Error: ${error.details[0].message}`);
    }
  
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
      id,
    ];

    // บันทึกข้อมูลลงฐานข้อมูล
    const result = await landModel.updateLandOne(values, id);
    console.log("result:", result);
    return {
      success: true,
      message: "อัพเดทข้อมูลที่ดินสำเร็จ!",
    };
  } catch (err) {
    console.log('erx:',err)
    throw {
      statusCode: err.statusCode || 500, // ใช้ 500 หากไม่มี statusCode
      message: `${err.message}`,
    };
  }
};

const UpdateLandUse = async (landData, id) => {
  console.log("-", landData);
  try {
    // Convert keys to database'S keys are
    const formattedLandUseData = {
      land_use_id: Number(landData.data.land_use_id),
      land_id: String(landData.data.land_id),
      rubber_tree: landData.data.rubber_tree == true ? "1" : "0",
      fruit_orchard: landData.data.fruit_orchard == true ? "1" : "0",
      livestock_farming: landData.data.livestock_farming == true ? "1" : "0",
      other: landData.data.other == true ? "1" : "0",
      details: String(landData.data.details || ""),
    };

    // ตรวจสอบความถูกต้องของข้อมูลตาม schema
    const { error, value } = landUseSchema.validate(formattedLandUseData);

    if (error) {
      throw new Error(`Validation Error: ${error}`);
    } else {
      console.log("Validated Data:", value);
    }

    const values = [
      value.rubber_tree,
      value.fruit_orchard,
      value.livestock_farming,
      value.other,
      value.details || null, // details ไม่ต้องแปลง
      value.land_id, // ใช้ค่า id_land
      value.land_use_id, // ใช้ค่า land_use_id
    ];
    console.log("values:", value);
    // บันทึกข้อมูลลงฐานข้อมูล
    const result = await landModel.updateLandUseOne(values);
    console.log("result:", true);
    // แจ้งเตือนเมื่อสำเร็จ
    if (result) {
      // ตรวจสอบว่ามีแถวถูกเพิ่มจริง
      console.log("อัพเดทข้อมูลการใช้ประโยชน์ที่ดิน!");
      return {
        success: true,
        message: "อัพเดทข้อมูลการใช้ประโยชน์ที่ดินสำเร็จ!",
      };
    } else {
      console.log("ไม่สามารถอัพเดทข้อมูลได้!");
      return { success: false, message: "ไม่สามารถอัพเดทข้อมูลได้!" };
    }
  } catch (err) {
    throw new Error(`Error updating landuse: ${err.message}`);
  }
};

// page and limit
const getLandPage = async (query, page_control) => {
  // console.log('query:',query)
  const { amount, page } = page_control;
  // console.log('page_control:',page_control)
  try {
    const result = await landModel.landAmountPage(page, amount, query);
    console.log("re:", result);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    throw new Error(`Error query land: ${error.message}`);
  }
};

const getLandHistoryPage = async (query, land_page_amount) => {
  const { amount, page } = land_page_amount;
  console.log("query:", query);
  try {
    const result = await landModel.landHistoryAmountPage(page, amount, query);
    // console.log('re-sult:',result)
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    throw new Error(`Error adding citizen: ${error.message}`);
  }
};

module.exports = {
  addLand,
  getLandPage,
  UpdateLand,
  UpdateLandUse,
  getLandHistoryPage,
};
