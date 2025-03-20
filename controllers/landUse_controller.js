// Model
const {
  landUsageModel,
  getOneLandUsageModel,
  updateOneLandUsageModel,
  getOneLandUsageActiveModel,
  createLandUsageModel,
  deleteLandUsageModel,
} = require("../model/commonModel");

const landUsageCTL = async (req, res) => {
  console.log("--------------- LandStatus ---------------");
  try {
    const results = await landUsageModel();
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const getOnelandUsageCTL = async (req, res) => {
  const { id } = req.params;
  console.log("id:", id);
  console.log("--------------- LandUse ---------------");
  try {
    const results = await getOneLandUsageModel(id);
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const getOneLandUsageActiveCTL = async (req, res) => {
  const { id } = req.params;
  console.log("id:", id);
  console.log("--------------- LandUse ---------------");
  try {
    const results = await getOneLandUsageActiveModel(id);
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const createLandUsageCTL = async (req, res) => {
  const { label } = req.body; // Access the sent data from the request body

  try {
    const values = [label];
    // console.log("vvv:", values);
    const results = await createLandUsageModel(label);
    return res.json({
      success: true,
      message: "เพิ่มข้อมูลสำเร็จ!",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        statusCode: 409,
        status: false,
        message: "ชื่อนี้มีอยู่ในระบบแล้ว กรุณาเลือกชื่อใหม่",
      });
    }

    // จัดการข้อผิดพลาดทั่วไปของฐานข้อมูล
    res.status(500).json({
      statusCode: 500,
      status: false,
      message: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล",
    });
  }
};

const updateOneLandUsageCTL = async (req, res) => {
  const { label } = req.body; // Access the sent data from the request body
  const id = req.params.id; // Get the ID from the URL
  console.log("id:", req.body);
  console.log("id-type:", id);

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }

  try {
    const values = [label, id];
    console.log("vvv:", values);
    const results = await updateOneLandUsageModel(values);
    if (results) {
      return res.json({
        success: true,
        message: "อัพเดทข้อมูลสำเร็จ!",
      });
    } else {
      console.log("ไม่สามารถอัพเดทข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถอัพเดทข้อมูลได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const delOneLandUsageCTL = async (req, res) => {
  const { actived } = req.body; // Access the sent data from the request body
  const id = req.params.id; // Get the ID from the URL
  console.log("id:", id);
  console.log("id-type:", actived);

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }

  try {
    const values = [actived, id];
    console.log("vvv:", values);
    const results = await deleteLandUsageModel(values);
    return res.json({
      success: true,
      message: "ลบข้อมูลสำเร็จ!",
      results,
    });
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

module.exports = {
  landUsageCTL,
  updateOneLandUsageCTL,
  getOnelandUsageCTL,
  getOneLandUsageActiveCTL,
  createLandUsageCTL,
  delOneLandUsageCTL,
};
