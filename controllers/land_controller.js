const landService = require("../services/LandService");
const landModel = require("../model/landModel");
const { getOneLandUse } = require("../model/commonModel");

// CTL = Controller
const addLandController = async (req, res) => {
  const landData = req.body;
  try {
    const newLand = await landService.addLand(landData);
    console.log("newland:", newLand);
    res.json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const updateLandCTL = async (req, res) => {
  const id = req.params.id;
  const landData = req.body;
  console.log("id:", id);
  // return res.status(200).json({koko:'22221111'});
  try {
    const newLand = await landService.UpdateLand(landData, id);
    if (!newLand) {
      return res.status(422);
    }
    res.status(200).json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const deleteLandByActiveCTL = async (req, res) => {
  const id = req.params.id;
  const active = req.body;
  console.log("id:", id);
  console.log("active:", active);
  if (!active.active) {
    console.log("return err");
  }
  try {
    const values = [active.active, id]
    const result = await landModel.changeActiveLand(values);
    console.log("result:", result);
    if (result) {
      return res.json({ success: result, message: "อัพเดทการใช้งานที่ดินสำเร็จ!" });
    } else {
      // console.log("ไม่สามารถอัพเดทข้อมูลได้!"); 
      return res.json({ success: false, message: "ไม่สามารถอัพเดทการใช้งานที่ดินข้อมูลได้!" });
    }
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getLandAmountPageCTL = async (req, res) => {
  const landData = req.params;
  console.log("land-data:", landData);
  try {
    const newLand = await landService.getLandPage();
    if (!newLand) {
      return res.status(422);
    }
    res.status(200).json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getLandIdCTL = async (req, res) => {
  const landData = req.params.id;
  console.log("land-data-id:", landData);
  // return res.json({"xaxa":'dsadsa'});
  try {
    const newLand = await landModel.getlandById(landData);
    res.json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

const getLandActiveCTL = async (req, res) => {
  const landData = req.params.id;
  console.log("land-data-id:", landData);
  try {
    const newLand = await landModel.getLandActive(landData);
    res.json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------- Land Use ----------------------------------------
const getLandUseByIdCTL = async (req, res) => {
  const landData = req.params.id;
  console.log("land-data-id:", landData);
  try {
    const newLand = await getOneLandUse(landData);
    res.json(newLand);
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).json({ message: err.message });
  }
};
// ---------------------------------------- End Land Use ----------------------------------------

module.exports = {
  addLandController,
  getLandAmountPageCTL,
  getLandIdCTL,
  updateLandCTL,
  getLandUseByIdCTL,
  getLandActiveCTL,
  deleteLandByActiveCTL,
};
