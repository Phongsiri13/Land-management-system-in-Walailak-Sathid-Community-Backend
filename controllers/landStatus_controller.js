// Model
const { landStatusModel, createStatusModel, getOneStatusActiveModel,
  getOneStatusModel, deleteStatusModel,updateOneStatusModel,
} = require("../model/commonModel");

const landStatusController = async (req, res) => {
  console.log("--------------- LandStatus ---------------");
  try {
    const results = await landStatusModel();
    res.json(results);
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const getOneStatusController = async (req, res) => {
  const { id } = req.params; 
  console.log('getOne:', req.params)

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }
  console.log("--------------- LandStatus get one ---------------");
  try {
    const values = [id];
    console.log('v:',values)
    const results = await getOneStatusModel(values);
    if (results) {
      return res.json({
        success: true,
        data: results
      });
    } else {
      console.log("ไม่สามารถเพิ่มข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถเพิ่มข้อมูลได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const createStatusController = async (req, res) => {
  const newStatus = req.body;
  console.log("--------------- LandStatus create ---------------");
  try {
    const values = [newStatus.newNameStatus];
    // console.log('v:',values)
    const results = await createStatusModel(values);
    if (results) {
      return res.json({
        success: true,
        message: "เพิ่มข้อมูลสถานะที่ดินสำเร็จ!",
      });
    } else {
      console.log("ไม่สามารถเพิ่มข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถเพิ่มข้อมูลได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const updateOneStatusController = async (req, res) => {
  const { land_status_name } = req.body;  // Access the sent data from the request body
  const id = req.params.id; // Get the ID from the URL
  console.log("id:", req.body);
  console.log("id-type:", id);

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }
  console.log("--------------- LandStatus updateOne ---------------");
  try {
    const values = [land_status_name, id];
    console.log('vvv:',values);
    const results = await updateOneStatusModel(values);
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

const getOneStatusActiveCTL = async (req, res) => {
  const { id } = req.params; 
  console.log('getOne:', req.params)

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }
  console.log("--------------- LandStatusActive get one ---------------");
  try {
    const values = [id];
    console.log('v:',values)
    const results = await getOneStatusActiveModel(values);
    if (results) {
      return res.json({
        success: true,
        data: results
      });
    } else {
      console.log("ไม่สามารถเพิ่มข้อมูลได้!");
      return res.json({ success: false, message: "ไม่สามารถเพิ่มข้อมูลได้!" });
    }
  } catch (err) {
    res.status(500).send("Database query error");
  }
};

const deleteStatusController = async (req, res) => {
  const { id } = req.params; // Access 'id' from the query string
  console.log("id:", id);
  console.log("id-type:", req.body);
  console.log('hi')

  if (!id) {
    return res.status(400).send({ message: "ID parameter is required" });
  }
  console.log("--------------- LandStatus delete ---------------");
  try {
    const values = [req.body.id , id];
    const results = await deleteStatusModel(values);
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
  landStatusController,
  getOneStatusController,
  createStatusController,
  deleteStatusController,
  updateOneStatusController,
  getOneStatusActiveCTL
};
