const landModel = require("../model/landModel");
const landSchemaCheck = require("../validation/landSchema");
const {landUseSchema} = require("../validation/landuseSchema");

// SV = service

// Mange adding Land
const addLand = async (landData) => {
  try {
    // Logic before sending to db
    console.log("land-data:", landData);
    // ตรวจสอบข้อมูลด้วย Joi ก่อน
    const { error, value } = landSchemaCheck.landSchema.validate(landData);
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
      "1",
    ];

    // บันทึกข้อมูลลงฐานข้อมูล
    const result = await landModel.addLand(values);
    console.log("result:", result);
    if ((result.status.statusCode = 200)) {
      return result;
    }
    if ((result.status.statusCode = 409)) {
      return result;
    }
    return result;
  } catch (err) {
    console.log("err:", err);
    throw new Error(`Error adding citizen: ${err.message}`);
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

    // Detect total of rai

    // ✅ แปลงค่าตัวเลขให้เป็น float หรือ null (กรณีไม่มีค่า)
    const values = [
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
    // แจ้งเตือนเมื่อสำเร็จ
    if (result) {
      // ตรวจสอบว่ามีแถวถูกเพิ่มจริง
      console.log("เพิ่มข้อมูลที่ดินสำเร็จ!");
      return {
        success: true,
        message: "อัพเดทข้อมูลที่ดินสำเร็จ!",
      };
    } else {
      console.log("ไม่สามารถอัพเดทข้อมูลได้!");
      return { success: false, message: "ไม่สามารถอัพเดทข้อมูลได้!" };
    }
  } catch (err) {
    throw new Error(`Error updating citizen: ${err.message}`);
  }
};

const UpdateLandUse = async (landData, id) => {
  console.log('-',landData)
  try {
    // convert 
    const formattedLandUseData = {
      land_use_id: Number(landData.data.land_use_id),
      land_id: String(landData.data.land_id),
      rubber_tree: landData.data.rubber_tree == true ? "1" : "0",
      fruit_orchard: landData.data.fruit_orchard == true ? "1" : "0",
      livestock_farming: landData.data.livestock_farming == true ? "1" : "0",
      other: landData.data.other == true  ? "1" : "0", 
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
  const {amount, page} = page_control
  // console.log('page_control:',page_control)
  try {
    const result = await landModel.landAmountPage(page, amount, query);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    throw new Error(`Error query land: ${error.message}`);
  }
};

const getLandHistoryPage = async (land_page_amount) => {
  // console.log('param:',land_page_amount.params.amount, ' : ', land_page_amount.params.page)
  const {amount, page } = land_page_amount;
  console.log(land_page_amount)
  try {
    const result = await landModel.landHistoryAmountPage(page,amount);
    console.log('re-sult:',result)
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    throw new Error(`Error adding citizen: ${error.message}`);
  }
}

module.exports = {
  addLand,
  getLandPage,
  UpdateLand,
  UpdateLandUse,
  getLandHistoryPage
};
