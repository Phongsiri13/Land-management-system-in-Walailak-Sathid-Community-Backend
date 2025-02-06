// Model
const {
  dcLandTypeModel,
  getOneDcLandTypeModel,
  createDcLandTypeModel,
  deleteDcLandTypeModel,
  updateDcLandTypeModel,
} = require("../model/commonModel");

const dcLandTypeController = async (req, res) => {
  console.log("--------------- Document Type ---------------");
  try {
    const results = await dcLandTypeModel();
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const getOneDcLandTypeController = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }
  console.log("--------------- LandStatus get one ---------------");
  try {
    const values = [parseInt(id)];
    const results = await getOneDcLandTypeModel(values);
    if (results) {
      return res.json({
        success: true,
        data: results,
      });
    } else {
      console.log("ไม่สามารถเพิ่มข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถเพิ่มข้อมูลได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const createDcLandTypeController = async (req, res) => {
  const {dc_type_name} = req.body;
  try {
    const values = [dc_type_name];
    // console.log('v:',values)
    const results = await createDcLandTypeModel(values);
    if (results) {
      return res.json({
        success: true,
        message: "เพิ่มข้อมูลประเภทไฟล์ที่ดินสำเร็จ!"
      });
    } else {
      console.log("ไม่สามารถเพิ่มข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถเพิ่มข้อมูลประเภทไฟล์ได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const updateDcLandTypeController = async (req, res) => {
  const { dc_type_name } = req.body; // Access the sent data from the request body
  const id = req.params.id; // Get the ID from the URL

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }

  try {
    const values = [dc_type_name, parseInt(id)];
    const results = await updateDcLandTypeModel(values);
    if (results) {
      return res.json({
        success: true,
        message: "อัพเดทสำเร็จ!",
      });
    } else {
      console.log("ไม่สามารถอัพเดทข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถอัพเดทข้อมูลได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const deleteDcLandTypeController = async (req, res) => {
  const { id } = req.params; // Access 'id' from the query string

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }

  try {
    const values = [parseInt(id)];
    const results = await deleteDcLandTypeModel(values);
    if (results) {
      return res.json({
        success: true,
        message: "ลบข้อมูลสำเร็จ!",
      });
    } else {
      console.log("ไม่สามารถเพิ่มข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถเพิ่มข้อมูลได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

module.exports = {
  dcLandTypeController,  
  getOneDcLandTypeController,
  createDcLandTypeController,
  deleteDcLandTypeController,
  updateDcLandTypeController
};
