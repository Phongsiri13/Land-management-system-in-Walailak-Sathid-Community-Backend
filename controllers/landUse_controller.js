// Model
const {
  landUsageModel,
  getOneLandUsageModel,
  updateOneLandUsageModel,
  getOneLandUsageActiveModel,
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
  console.log("idxa:", id);
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

module.exports = {
  landUsageCTL,
  updateOneLandUsageCTL,
  getOnelandUsageCTL,
  getOneLandUsageActiveCTL
};
